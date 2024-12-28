import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { GameInfo } from "./GameInfo";

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
  };
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{prediction.user.display_name}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(prediction.game.game_date), "PPp")}
            </p>
          </div>
          
          <GameInfo 
            game={prediction.game}
            prediction={{
              prediction_home_score: prediction.prediction_home_score,
              prediction_away_score: prediction.prediction_away_score,
              points_earned: prediction.points_earned
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}