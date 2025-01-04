import { Card, CardContent } from "@/components/ui/card";
import { PointsBreakdownDialog } from "../games/PointsBreakdownDialog";
import { useState } from "react";
import { PredictionDisplay } from "../games/PredictionDisplay";
import { GameInfo } from "./predictions/GameInfo";

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
    game_results?: Array<{
      home_score: number;
      away_score: number;
      is_final?: boolean;
    }>;
  };
  prediction: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  } | null;
  isOwnPrediction?: boolean;
}

export function UserPredictionCard({ 
  game, 
  prediction,
  isOwnPrediction = false
}: UserPredictionCardProps) {
  const [showPointsBreakdown, setShowPointsBreakdown] = useState(false);
  const gameResult = game.game_results?.[0];

  if (!prediction) {
    return null;
  }

  const handlePointsClick = () => {
    if (gameResult && prediction?.points_earned !== undefined) {
      setShowPointsBreakdown(true);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-all duration-300">
        <CardContent className="pt-8 px-6">
          <div className="flex flex-col items-center space-y-6">
            <GameInfo game={game} prediction={prediction} />
            <div className="mt-6 mb-4 w-full">
              <PredictionDisplay
                homeScore={prediction.prediction_home_score}
                awayScore={prediction.prediction_away_score}
                pointsEarned={prediction.points_earned}
                onClick={handlePointsClick}
                showBreakdownHint={!!gameResult && prediction.points_earned !== undefined}
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
          isOwnPrediction={isOwnPrediction}
        />
      )}
    </>
  );
}