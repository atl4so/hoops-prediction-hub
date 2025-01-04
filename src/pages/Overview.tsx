import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserProfile } from "@/components/dashboard/UserProfile";
import { useCurrentRoundRank } from "@/components/dashboard/useCurrentRoundRank";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/dashboard/sections/DashboardStats";

export default function Overview() {
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

  if (profileError) {
    toast.error("Failed to load data");
    return null;
  }

  // Calculate statistics
  const totalPoints = userProfileData?.total_points || 0;
  const totalPredictions = userProfileData?.total_predictions || 0;
  const pointsPerGame = userProfileData?.points_per_game || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
          Overview
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          Track your performance and statistics
        </p>
      </section>
      
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
    </div>
  );
}