import { Card, CardContent } from "@/components/ui/card";
import { GameDateTime } from "../games/GameDateTime";
import { PointsBreakdownDialog } from "../games/PointsBreakdownDialog";
import { useState } from "react";
import { PredictionDisplay } from "../games/PredictionDisplay";

interface UserPredictionCardProps {
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
  };
  prediction: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  };
  gameResult?: {
    home_score: number;
    away_score: number;
  };
  isOwnPrediction?: boolean;
}

export function UserPredictionCard({ 
  game, 
  prediction, 
  gameResult,
  isOwnPrediction = false
}: UserPredictionCardProps) {
  const [showPointsBreakdown, setShowPointsBreakdown] = useState(false);

  const handlePointsClick = () => {
    if (gameResult && prediction.points_earned !== undefined) {
      setShowPointsBreakdown(true);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <GameDateTime date={game.game_date} />
            <div className="grid grid-cols-3 items-center gap-4 w-full">
              <div className="flex flex-col items-center">
                <img
                  src={game.home_team.logo_url}
                  alt={game.home_team.name}
                  className="w-16 h-16 object-contain"
                />
                <p className="text-sm mt-2 text-center">{game.home_team.name}</p>
              </div>
              <div className="text-xl font-semibold text-center">
                {gameResult ? (
                  <span>{gameResult.home_score} - {gameResult.away_score}</span>
                ) : (
                  <span>vs</span>
                )}
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={game.away_team.logo_url}
                  alt={game.away_team.name}
                  className="w-16 h-16 object-contain"
                />
                <p className="text-sm mt-2 text-center">{game.away_team.name}</p>
              </div>
            </div>

            <div className="mt-4 mb-2">
              <PredictionDisplay
                homeScore={prediction.prediction_home_score}
                awayScore={prediction.prediction_away_score}
                pointsEarned={prediction.points_earned}
                onClick={handlePointsClick}
                showBreakdownHint={!!gameResult && prediction.points_earned !== undefined}
                label={isOwnPrediction ? "Your Prediction" : "Prediction"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {gameResult && prediction.points_earned !== undefined && (
        <PointsBreakdownDialog
          isOpen={showPointsBreakdown}
          onOpenChange={setShowPointsBreakdown}
          prediction={{
            prediction_home_score: prediction.prediction_home_score,
            prediction_away_score: prediction.prediction_away_score
          }}
          result={{
            home_score: gameResult.home_score,
            away_score: gameResult.away_score
          }}
          points={prediction.points_earned}
        />
      )}
    </>
  );
}