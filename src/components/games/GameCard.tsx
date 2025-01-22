import { Card, CardContent } from "@/components/ui/card";
import { GameScoreDisplay } from "./prediction/GameScoreDisplay";
import { PredictionButton } from "./prediction/PredictionButton";
import { useState } from "react";
import { GameStatsModal } from "./stats/GameStatsModal";
import { StatsButton } from "./stats/StatsButton";

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
  const [showStats, setShowStats] = useState(false);
  const gameResult = game.game_results?.[0];
  const isFinished = gameResult?.is_final;

  return (
    <>
      <Card className="w-full">
        <CardContent className="p-6">
          <GameScoreDisplay game={game} />
          
          <div className="mt-6 space-y-3">
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

            {isFinished && (
              <StatsButton onClick={() => setShowStats(true)} />
            )}
          </div>
        </CardContent>
      </Card>

      {isFinished && (
        <GameStatsModal
          isOpen={showStats}
          onOpenChange={setShowStats}
          gameId={game.id}
          homeTeam={game.home_team}
          awayTeam={game.away_team}
        />
      )}
    </>
  );
}