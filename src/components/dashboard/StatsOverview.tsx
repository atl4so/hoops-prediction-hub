import { StatsList } from "./stats/StatsList";
import { RoundPerformance } from "./stats/RoundPerformance";
import type { StatsListProps } from "@/types/supabase";
import { UserPredictionsGrid } from "./predictions/UserPredictionsGrid";
import { useUserPredictions } from "./useUserPredictions";

export function StatsOverview(props: StatsListProps) {
  const { data: rawPredictions, isLoading: isLoadingPredictions } = useUserPredictions(props.userId);

  // Transform predictions to match the expected format
  const transformedPredictions = rawPredictions?.map(pred => ({
    id: pred.id,
    game: {
      id: pred.game.id,
      game_date: pred.game.game_date,
      home_team: pred.game.home_team,
      away_team: pred.game.away_team,
      game_results: Array.isArray(pred.game.game_results) 
        ? pred.game.game_results 
        : pred.game.game_results 
          ? [pred.game.game_results]
          : []
    },
    prediction: {
      prediction_home_score: pred.prediction_home_score,
      prediction_away_score: pred.prediction_away_score,
      points_earned: pred.points_earned
    }
  }));

  return (
    <div className="space-y-6">
      <StatsList {...props} />
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Your Predictions</h2>
        <div className="rounded-lg border">
          <UserPredictionsGrid 
            predictions={transformedPredictions} 
            isLoading={isLoadingPredictions} 
          />
        </div>
      </div>
      <RoundPerformance userId={props.userId} />
    </div>
  );
}