import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { CollapsibleRoundSection } from "@/components/dashboard/CollapsibleRoundSection";
import { useUserProfile } from "@/components/dashboard/UserProfile";
import { useCurrentRoundRank } from "@/components/dashboard/useCurrentRoundRank";
import { useUserPredictions } from "@/components/dashboard/useUserPredictions";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GamesList } from "@/components/games/GamesList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

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

  console.log('Dashboard predictions:', predictions);

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
    acc[roundId].predictions.push({
      id: prediction.id,
      game: {
        ...prediction.game,
        game_results: prediction.game.game_results || []
      },
      prediction: {
        prediction_home_score: prediction.prediction_home_score,
        prediction_away_score: prediction.prediction_away_score,
        points_earned: prediction.points_earned
      }
    });
    return acc;
  }, {} as Record<string, { roundId: string; roundName: string; predictions: any[] }>);

  console.log('Grouped predictions by round:', predictionsByRound);

  return (
    <div className="space-y-8">
      <DashboardHeader />
      
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

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Available Games</h2>
        <GamesList isAuthenticated={!!session} userId={userId || undefined} />
      </div>

      <Separator className="my-8" />

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Your Predictions</h2>
        <div className="rounded-lg border">
          <Accordion type="single" collapsible className="w-full">
            {predictionsByRound && Object.values(predictionsByRound).map((roundData) => (
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
                    userName={userProfileData?.display_name || "User"}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}