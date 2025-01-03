import { Card, CardContent } from "@/components/ui/card";
import { TeamDisplay } from "./TeamDisplay";
import { GameDateTime } from "./GameDateTime";
import { PredictionButton } from "./prediction/PredictionButton";
import { PredictionDisplay } from "./PredictionDisplay";
import { PointsBreakdownDialog } from "./PointsBreakdownDialog";
import { CountdownTimer } from "./CountdownTimer";
import { useState } from "react";

interface GameCardProps {
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
  isAuthenticated: boolean;
  userId?: string;
  prediction?: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  };
}

export function GameCard({ game, isAuthenticated, userId, prediction }: GameCardProps) {
  const [showPointsBreakdown, setShowPointsBreakdown] = useState(false);

  const gameResult = game.game_results?.[0];
  const isUpcoming = !gameResult && new Date(game.game_date) > new Date();

  const handlePointsClick = () => {
    if (gameResult && prediction?.points_earned !== undefined) {
      setShowPointsBreakdown(true);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent className="pt-6 px-4 sm:px-6 flex-1 flex flex-col">
        <div className="flex flex-col h-full">
          <div className="space-y-1">
            <GameDateTime date={game.game_date} />
            {isUpcoming && (
              <CountdownTimer gameDate={game.game_date} />
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center flex-1 mt-4">
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

          {prediction && (
            <div className="mt-4 mb-2">
              <PredictionDisplay
                homeScore={prediction.prediction_home_score}
                awayScore={prediction.prediction_away_score}
                pointsEarned={prediction.points_earned}
                onClick={handlePointsClick}
                showBreakdownHint={!!gameResult && prediction.points_earned !== undefined}
              />
            </div>
          )}

          <div className="mt-4">
            <PredictionButton
              isAuthenticated={isAuthenticated}
              gameDate={game.game_date}
              gameId={game.id}
              userId={userId}
              prediction={prediction}
              gameResult={gameResult}
              homeTeam={game.home_team}
              awayTeam={game.away_team}
            />
          </div>
        </div>
      </CardContent>

      {prediction?.points_earned !== undefined && gameResult && (
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
    </Card>
  );
}