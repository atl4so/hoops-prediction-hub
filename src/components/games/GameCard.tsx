import { Card, CardContent } from "@/components/ui/card";
import { PredictionButton } from "./prediction/PredictionButton";
import { PredictionDisplay } from "./PredictionDisplay";
import { PointsBreakdownDialog } from "./PointsBreakdownDialog";
import { useState } from "react";
import { PredictionInsightsDialog } from "./prediction/PredictionInsightsDialog";
import { FinishedGameInsightsDialog } from "./prediction/insights/FinishedGameInsightsDialog";
import { GameScoreDisplay } from "./prediction/GameScoreDisplay";
import { InsightsButton } from "./prediction/insights/InsightsButton";
import { StatsButton } from "./stats/StatsButton";
import { GameStatsModal } from "./stats/GameStatsModal";

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
    game_code?: string;
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
  const [showInsights, setShowInsights] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const gameResult = game.game_results?.[0];
  const isUpcoming = !gameResult && new Date(game.game_date) > new Date();

  const handlePointsClick = () => {
    if (gameResult && prediction?.points_earned !== undefined) {
      setShowPointsBreakdown(true);
    }
  };

  return (
    <>
      <Card className="game-card w-full h-full flex flex-col">
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex flex-col h-full">
            <GameScoreDisplay game={game} isUpcoming={isUpcoming} />

            {prediction && (
              <div className="mt-6">
                <PredictionDisplay
                  homeScore={prediction.prediction_home_score}
                  awayScore={prediction.prediction_away_score}
                  pointsEarned={prediction.points_earned}
                  onClick={handlePointsClick}
                  showBreakdownHint={!!gameResult && prediction.points_earned !== undefined}
                />
              </div>
            )}

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
              
              <InsightsButton 
                onClick={() => setShowInsights(true)}
                gameResult={gameResult}
              />

              {gameResult?.is_final && game.game_code && (
                <StatsButton onClick={() => setShowStats(true)} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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

      {isUpcoming ? (
        <PredictionInsightsDialog
          isOpen={showInsights}
          onOpenChange={setShowInsights}
          gameId={game.id}
        />
      ) : gameResult && (
        <FinishedGameInsightsDialog
          isOpen={showInsights}
          onOpenChange={setShowInsights}
          gameId={game.id}
          finalScore={{
            home: gameResult.home_score,
            away: gameResult.away_score
          }}
        />
      )}

      {gameResult?.is_final && game.game_code && (
        <GameStatsModal
          isOpen={showStats}
          onOpenChange={setShowStats}
          gameId={game.game_code}
        />
      )}
    </>
  );
}