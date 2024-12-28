import { Card, CardContent } from "@/components/ui/card";
import { TeamDisplay } from "./TeamDisplay";
import { GameDateTime } from "./GameDateTime";
import { PredictionButton } from "./PredictionButton";
import { PredictionDialog } from "../predictions/PredictionDialog";
import { PredictionDisplay } from "./PredictionDisplay";
import { PointsBreakdownDialog } from "./PointsBreakdownDialog";
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
      is_final?: boolean;
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
  const [showPredictionDialog, setShowPredictionDialog] = useState(false);
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

          {prediction && (
            <div 
              className="mt-4 mb-2 cursor-pointer" 
              onClick={() => gameResult && setShowPointsBreakdown(true)}
            >
              <PredictionDisplay
                homeScore={prediction.prediction_home_score}
                awayScore={prediction.prediction_away_score}
                pointsEarned={prediction.points_earned}
              />
            </div>
          )}

          <div className="mt-6">
            <PredictionButton
              isAuthenticated={isAuthenticated}
              gameDate={game.game_date}
              onPrediction={() => setShowPredictionDialog(true)}
              gameId={game.id}
              userId={userId}
              prediction={prediction}
              gameResult={gameResult}
            />
          </div>
        </div>
      </CardContent>

      <PredictionDialog
        isOpen={showPredictionDialog}
        onOpenChange={setShowPredictionDialog}
        gameId={game.id}
        userId={userId}
        gameDate={game.game_date}
        homeTeam={game.home_team}
        awayTeam={game.away_team}
      />

      {prediction?.points_earned !== undefined && gameResult && (
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