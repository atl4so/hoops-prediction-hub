import { Skeleton } from "@/components/ui/skeleton";
import { UserPredictionCard } from "../UserPredictionCard";

interface UserPredictionsGridProps {
  predictions: any[] | undefined;
  isLoading: boolean;
  isOwnPredictions?: boolean;
}

export function UserPredictionsGrid({ 
  predictions, 
  isLoading,
  isOwnPredictions = false
}: UserPredictionsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-[200px]" />
        ))}
      </div>
    );
  }

  if (!predictions || predictions.length === 0) {
    return (
      <p className="text-muted-foreground col-span-2 text-center py-8">
        No predictions found for the selected round.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {predictions.map((prediction) => (
        <UserPredictionCard
          key={prediction.game.id}
          game={prediction.game}
          prediction={{
            prediction_home_score: prediction.prediction_home_score,
            prediction_away_score: prediction.prediction_away_score,
            points_earned: prediction.points_earned
          }}
          gameResult={prediction.game.game_results?.[0]}
          isOwnPrediction={isOwnPredictions}
        />
      ))}
    </div>
  );
}