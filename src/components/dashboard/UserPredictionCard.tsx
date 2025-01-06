import { Card, CardContent } from "@/components/ui/card";
import { PointsBreakdownDialog } from "../games/PointsBreakdownDialog";
import { useState } from "react";
import { PredictionDisplay } from "../games/PredictionDisplay";
import { GameInfo } from "./predictions/GameInfo";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { PredictionInsightsDialog } from "../games/prediction/PredictionInsightsDialog";

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
  const [showInsights, setShowInsights] = useState(false);
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
      <Card className="hover:shadow-md transition-all duration-300 h-full">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col h-full space-y-4">
            <GameInfo game={game} prediction={prediction} />
            <div className="w-full mt-auto space-y-3">
              <PredictionDisplay
                homeScore={prediction.prediction_home_score}
                awayScore={prediction.prediction_away_score}
                pointsEarned={prediction.points_earned}
                onClick={handlePointsClick}
                showBreakdownHint={!!gameResult && prediction.points_earned !== undefined}
              />
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowInsights(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                How Others Predict
              </Button>
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

      <PredictionInsightsDialog
        isOpen={showInsights}
        onOpenChange={setShowInsights}
        gameId={game.id}
      />
    </>
  );
}