import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserProfile } from "@/components/dashboard/UserProfile";
import { useCurrentRoundRank } from "@/components/dashboard/useCurrentRoundRank";
import { useUserPredictions } from "@/components/dashboard/useUserPredictions";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/sections/DashboardStats";
import { DashboardPredictions } from "@/components/dashboard/sections/DashboardPredictions";
import { DashboardGames } from "@/components/dashboard/sections/DashboardGames";

export default function Dashboard() {
  const session = useSession();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }
    setUserId(session.user.id);
  }, [session, navigate]);

  useEffect(() => {
    if (!userId) return;

    const gameResultsChannel = supabase
      .channel('game-results-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_results'
        },
        () => {
          console.log('Game results changed, invalidating queries...');
          queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
          queryClient.invalidateQueries({ queryKey: ['userPredictions', userId] });
          queryClient.invalidateQueries({ queryKey: ['currentRoundRank', userId] });
          queryClient.invalidateQueries({ queryKey: ['games'] });
        }
      )
      .subscribe((status) => {
        console.log('Game results subscription status:', status);
      });

    return () => {
      supabase.removeChannel(gameResultsChannel);
    };
  }, [userId, queryClient]);

  const { data: userProfileData, isError: profileError } = useUserProfile(userId);
  const { data: currentRoundRank } = useCurrentRoundRank(userId);
  const { data: predictions, isError: predictionsError } = useUserPredictions(userId);

  if (profileError || predictionsError) {
    toast.error("Failed to load data");
    return null;
  }

  // Calculate statistics
  const totalPoints = userProfileData?.total_points || 0;
  const totalPredictions = userProfileData?.total_predictions || 0;
  const pointsPerGame = userProfileData?.points_per_game || 0;

  // Group predictions by round
  const predictionsByRound = predictions?.reduce((acc, prediction) => {
    const roundId = prediction.game.round.id;
    if (!acc[roundId]) {
      acc[roundId] = {
        roundId,
        roundName: prediction.game.round.name,
        predictions: []
      };
    }
    acc[roundId].predictions.push(prediction);
    return acc;
  }, {} as Record<string, { roundId: string; roundName: string; predictions: typeof predictions }>) || {};

  return (
    <div className="space-y-8">
      <DashboardHeader />
      
      <DashboardStats
        totalPoints={totalPoints}
        pointsPerGame={pointsPerGame}
        totalPredictions={totalPredictions}
        highestGamePoints={userProfileData?.highest_game_points}
        lowestGamePoints={userProfileData?.lowest_game_points}
        highestRoundPoints={userProfileData?.highest_round_points}
        lowestRoundPoints={userProfileData?.lowest_round_points}
        allTimeRank={userProfileData?.allTimeRank}
        currentRoundRank={currentRoundRank}
        userId={userId}
      />

      <DashboardPredictions
        predictionsByRound={predictionsByRound}
        userName={userProfileData?.display_name || "User"}
      />

      <Separator className="my-8" />

      <DashboardGames
        isAuthenticated={!!session}
        userId={userId || undefined}
      />
    </div>
  );
}