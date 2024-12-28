import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface PredictionCardProps {
  prediction: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned: number | null;
    user: {
      id: string;
      display_name: string;
    };
    game: {
      id: string;
      game_date: string;
      home_team: {
        name: string;
      };
      away_team: {
        name: string;
      };
      game_results: Array<{
        home_score: number;
        away_score: number;
        is_final: boolean;
      }>;
    };
  };
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  return (
    <Card key={`${prediction.user.id}-${prediction.game.id}`}>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{prediction.user.display_name}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(prediction.game.game_date), "PPp")}
            </p>
          </div>
          <div className="text-sm">
            <p>
              {prediction.game.home_team.name} vs {prediction.game.away_team.name}
            </p>
            <p className="font-medium">
              Prediction: {prediction.prediction_home_score} - {prediction.prediction_away_score}
            </p>
            {prediction.points_earned !== null && (
              <p className="text-primary">
                Points earned: {prediction.points_earned}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}