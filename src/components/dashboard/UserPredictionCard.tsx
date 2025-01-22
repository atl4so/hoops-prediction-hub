import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GameInfo } from "./predictions/GameInfo";
import { PredictionDisplay } from "@/components/games/PredictionDisplay";
import { PointsBreakdownDialog } from "@/components/games/PointsBreakdownDialog";
import { PredictionInsightsDialog } from "@/components/games/prediction/PredictionInsightsDialog";
import { FinishedGameInsightsDialog } from "@/components/games/prediction/insights/FinishedGameInsightsDialog";
import { GameStatsModal } from "@/components/games/stats/GameStatsModal";
import { PredictionActions } from "./predictions/card/PredictionActions";
import { sharePrediction } from "./predictions/card/SharePrediction";

interface UserPredictionCardProps {
  game: {
    id: string;
    game_code?: string;
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
      is_final: boolean;
    }>;
  };
  prediction: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  };
  isOwnPrediction?: boolean;
  userName?: string;
}

export function UserPredictionCard({ 
  game, 
  prediction, 
  isOwnPrediction = false,
  userName = "Anonymous"
}: UserPredictionCardProps) {
  const [showPointsBreakdown, setShowPointsBreakdown] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const gameResult = game.game_results?.[0];

  console.log('Game data in UserPredictionCard:', {
    id: game.id,
    gameCode: game.game_code,
    hasGameResults: !!gameResult,
    isFinal: gameResult?.is_final
  });

  const handlePointsClick = () => {
    if (gameResult && prediction.points_earned !== undefined) {
      setShowPointsBreakdown(true);
    }
  };

  const handleShare = async () => {
    await sharePrediction({
      gameId: game.id,
      content: contentRef.current
    });
  };

  return (
    <>
      <Card className="game-card w-full h-full flex flex-col">
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex flex-col h-full" data-game-id={game.id} ref={contentRef}>
            <GameInfo game={game} prediction={prediction} />
            
            {prediction && (
              <div className="mt-6">
                <PredictionDisplay
                  homeScore={prediction.prediction_home_score}
                  awayScore={prediction.prediction_away_score}
                  pointsEarned={prediction.points_earned}
                  onClick={handlePointsClick}
                  showBreakdownHint={!!gameResult && prediction.points_earned !== undefined}
                  data-points-breakdown
                />
              </div>
            )}

            <PredictionActions
              onShare={handleShare}
              onInsightsClick={() => setShowInsights(true)}
              onStatsClick={() => setShowStats(true)}
              gameResult={gameResult}
              gameCode={game.game_code}
            />
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

      {gameResult && (
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

      {game.game_code && (
        <GameStatsModal
          isOpen={showStats}
          onOpenChange={setShowStats}
          gameId={game.game_code}
        />
      )}
    </>
  );
}