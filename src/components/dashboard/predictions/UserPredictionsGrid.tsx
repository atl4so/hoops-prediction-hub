import { Skeleton } from "@/components/ui/skeleton";
import { UserPredictionCard } from "../UserPredictionCard";
import { Card, CardContent } from "@/components/ui/card";

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
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[200px]" />
        ))}
      </div>
    );
  }

  if (!predictions || predictions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-muted-foreground text-center">
            No predictions found for the selected round.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {predictions.map((prediction) => (
        <UserPredictionCard
          key={prediction.id}
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