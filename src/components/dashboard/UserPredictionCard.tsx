import { Card, CardContent } from "@/components/ui/card";
import { TeamDisplay } from "../games/TeamDisplay";
import { GameDateTime } from "../games/GameDateTime";
import { PointsBreakdownDialog } from "../games/PointsBreakdownDialog";
import { useState } from "react";

interface UserPredictionCardProps {
  game: {
    id: string;
    game_date: string;
    home_team: {
      id: string;
      name: string;
      logo_url: string;
    };
    away_team: {
      id: string;
      name: string;
      logo_url: string;
    };
    game_results?: Array<{
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
}

export function UserPredictionCard({ game, prediction }: UserPredictionCardProps) {
  const [showPointsBreakdown, setShowPointsBreakdown] = useState(false);
  const gameResult = game.game_results?.[0];

  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent className="pt-6 px-6 flex-1 flex flex-col">
        <div className="flex flex-col h-full">
          <GameDateTime date={game.game_date} />
          
          <div className="grid grid-cols-3 gap-4 items-center flex-1">
            <TeamDisplay
              align="right"
              team={game.home_team}
            />
            <div className="text-center text-lg font-bold">
              {gameResult ? (
                `${gameResult.home_score} - ${gameResult.away_score}`
              ) : (
                'vs'
              )}
            </div>
            <TeamDisplay
              align="left"
              team={game.away_team}
            />
          </div>

          <div className="mt-4 mb-2 cursor-pointer" onClick={() => gameResult && setShowPointsBreakdown(true)}>
            <div className="text-sm text-center space-y-1">
              <p className="font-medium">Prediction</p>
              <p>
                {prediction.prediction_home_score} - {prediction.prediction_away_score}
              </p>
              {prediction.points_earned !== undefined && (
                <div className="space-y-1">
                  <p className="text-primary">Points: {prediction.points_earned}</p>
                  <p className="text-xs text-muted-foreground hover:text-primary cursor-pointer underline">
                    Click to see points breakdown
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {prediction.points_earned !== undefined && gameResult && (
        <PointsBreakdownDialog
          isOpen={showPointsBreakdown}
          onClose={() => setShowPointsBreakdown(false)}
          prediction={prediction}
          result={{
            home_score: gameResult.home_score,
            away_score: gameResult.away_score
          }}
        />
      )}
    </Card>
  );
}