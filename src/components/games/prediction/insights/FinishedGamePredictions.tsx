import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinishedGamePredictionsProps {
  predictions: Array<{
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned: number | null;
    profiles: {
      display_name: string;
      avatar_url: string | null;
    };
  }>;
  finalScore: {
    home: number;
    away: number;
  };
}

export function FinishedGamePredictions({
  predictions,
  finalScore,
}: FinishedGamePredictionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">All Predictions</h3>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {predictions.map((prediction, index) => {
          const isCorrectWinner =
            (prediction.prediction_home_score > prediction.prediction_away_score) ===
            (finalScore.home > finalScore.away);

          return (
            <Card
              key={index}
              className={cn(
                "transition-colors",
                isCorrectWinner ? "bg-green-50" : "bg-red-50"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      {prediction.profiles.avatar_url ? (
                        <AvatarImage
                          src={prediction.profiles.avatar_url}
                          alt={prediction.profiles.display_name}
                        />
                      ) : null}
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {prediction.profiles.display_name}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">
                      {prediction.prediction_home_score} - {prediction.prediction_away_score}
                    </span>
                    {prediction.points_earned !== null && (
                      <span className="ml-2 text-primary">
                        ({prediction.points_earned} pts)
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}