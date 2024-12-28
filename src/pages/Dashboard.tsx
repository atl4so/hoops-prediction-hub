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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

    return () => {
      supabase.removeChannel(gameResultsChannel);
      supabase.removeChannel(predictionsChannel);
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
    acc[roundId].predictions.push({
      id: prediction.id,
      game: {
        id: prediction.game.id,
        game_date: prediction.game.game_date,
        home_team: prediction.game.home_team,
        away_team: prediction.game.away_team,
        game_results: prediction.game.game_results
      },
      prediction: {
        prediction_home_score: prediction.prediction_home_score,
        prediction_away_score: prediction.prediction_away_score,
        points_earned: prediction.points_earned
      }
    });
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

      <div className="rounded-lg border">
        <Accordion type="single" collapsible className="w-full">
          {predictionsByRound && Object.values(predictionsByRound)
            .sort((a: any, b: any) => parseInt(b.roundName) - parseInt(a.roundName))
            .map((roundData: any) => (
              <AccordionItem key={roundData.roundId} value={roundData.roundId}>
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-accent/50">
                  <span className="text-sm font-medium">
                    Round {roundData.roundName}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-4">
                  <CollapsibleRoundSection
                    roundId={roundData.roundId}
                    roundName={roundData.roundName}
                    predictions={roundData.predictions}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}