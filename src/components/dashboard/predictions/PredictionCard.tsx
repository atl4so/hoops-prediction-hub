import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { GameInfo } from "./GameInfo";
import { PredictionDisplay } from "@/components/games/PredictionDisplay";
import { useState } from "react";
import { PointsBreakdownDialog } from "@/components/games/PointsBreakdownDialog";
import { cn } from "@/lib/utils";

interface PredictionCardProps {
  prediction: {
    user: {
      id: string;
      display_name: string;
      avatar_url?: string;
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
      game_results?: Array<{
        home_score: number;
        away_score: number;
        is_final?: boolean;
      }>;
    };
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  };
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const [showPointsBreakdown, setShowPointsBreakdown] = useState(false);
  const gameResult = prediction.game.game_results?.[0];

  const handlePointsClick = () => {
    if (gameResult && prediction.points_earned !== undefined) {
      setShowPointsBreakdown(true);
    }
  };

  const getCardClassName = () => {
    return cn(
      "game-card glass-card transition-all duration-300",
      !gameResult && "game-card-upcoming",
      gameResult?.is_final && "game-card-finished",
      prediction.points_earned !== undefined && "game-card-prediction"
    );
  };

  return (
    <>
      <Card className={getCardClassName()}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-6 w-6">
                {prediction.user.avatar_url ? (
                  <AvatarImage src={prediction.user.avatar_url} alt={prediction.user.display_name} />
                ) : null}
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{prediction.user.display_name}</span>
            </div>
            <GameInfo game={prediction.game} prediction={prediction} />
            <div className="mt-4 mb-2">
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
        />
      )}
    </>
  );
}