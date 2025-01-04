import { Card, CardContent } from "@/components/ui/card";
import { PointsBreakdownDialog } from "../games/PointsBreakdownDialog";
import { useState } from "react";
import { PredictionDisplay } from "../games/PredictionDisplay";
import { GameInfo } from "./predictions/GameInfo";
import { cn } from "@/lib/utils";

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

  const getCardClassName = () => {
    return cn(
      "game-card glass-card transition-all duration-300",
      gameResult?.is_final && "game-card-finished",
      prediction.points_earned !== undefined && "game-card-prediction"
    );
  };

  return (
    <>
      <Card className={getCardClassName()}>
        <CardContent className="pt-10 px-8 pb-8 h-full">
          <div className="flex flex-col items-center justify-between h-full space-y-8">
            <GameInfo game={game} prediction={prediction} />
            <div className="w-full">
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