import { Skeleton } from "@/components/ui/skeleton";
import { UserPredictionCard } from "../UserPredictionCard";
import { Card, CardContent } from "@/components/ui/card";

interface UserPredictionsGridProps {
  predictions: Array<{
    id: string;
    game: {
      id: string;
      game_date: string;
      home_team: {
        name: string;
        logo_url: string;
      };
      away_team: {
        name: string;
        logo_url: string;
      };
      game_results: Array<{
        home_score: number;
        away_score: number;
        is_final: boolean;
      }>;
    };
    prediction: {
      prediction_home_score: number;
      prediction_away_score: number;
      points_earned?: number;
    };
  }> | undefined;
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
          prediction={prediction.prediction}
          isOwnPrediction={isOwnPredictions}
        />
      ))}
    </div>
  );
}