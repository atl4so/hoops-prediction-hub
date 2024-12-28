import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { FollowingSection } from "@/components/dashboard/FollowingSection";
import { CollapsibleRoundSection } from "@/components/dashboard/CollapsibleRoundSection";
import { useUserProfile } from "@/components/dashboard/UserProfile";
import { useCurrentRoundRank } from "@/components/dashboard/useCurrentRoundRank";
import { useUserPredictions } from "@/components/dashboard/useUserPredictions";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  // Enhanced real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    // Subscribe to game results changes
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
        }
      )
      .subscribe();

    // Subscribe to predictions changes
    const predictionsChannel = supabase
      .channel('predictions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions'
        },
        () => {
          console.log('Predictions changed, invalidating queries...');
          queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
          queryClient.invalidateQueries({ queryKey: ['userPredictions', userId] });
          queryClient.invalidateQueries({ queryKey: ['currentRoundRank', userId] });
        }
      )
      .subscribe();

    // Subscribe to profile changes
    const profileChannel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        () => {
          console.log('Profile changed, invalidating queries...');
          queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameResultsChannel);
      supabase.removeChannel(predictionsChannel);
      supabase.removeChannel(profileChannel);
    };
  }, [userId, queryClient]);

  const { data: userProfileData, isError: profileError } = useUserProfile(userId);
  const { data: currentRoundRank } = useCurrentRoundRank(userId);
  const { data: predictions, isError: predictionsError } = useUserPredictions(userId);

  if (profileError || predictionsError) {
    toast.error("Failed to load data");
    return null;
  }

  // Group predictions by round
  const predictionsByRound = predictions?.reduce((acc: any, prediction: any) => {
    const roundId = prediction.game.round_id;
    const roundName = prediction.game.round.name;
    if (!acc[roundId]) {
      acc[roundId] = {
        roundId,
        roundName,
        predictions: []
      };
    }
    acc[roundId].predictions.push(prediction);
    return acc;
  }, {});

  // Calculate statistics
  const totalPoints = userProfileData?.total_points || 0;
  const totalPredictions = userProfileData?.total_predictions || 0;
  const pointsPerGame = userProfileData?.points_per_game || 0;

  return (
    <div className="space-y-8">
      <StatsOverview
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

      <FollowingSection />

      <div className="space-y-4">
        {predictionsByRound && Object.values(predictionsByRound).map((roundData: any) => (
          <CollapsibleRoundSection
            key={roundData.roundId}
            roundId={roundData.roundId}
            roundName={roundData.roundName}
            predictions={roundData.predictions}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
}