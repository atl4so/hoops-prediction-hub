import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GameInfo } from "@/components/dashboard/predictions/GameInfo";
import { PredictionButton } from "./prediction/PredictionButton";
import { PredictionDialog } from "@/components/predictions/PredictionDialog";
import { PredictionInsightsDialog } from "./prediction/insights/PredictionInsightsDialog";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameCardProps {
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
  userId?: string;
  isAuthenticated: boolean;
  prediction?: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  } | null;
}

export function GameCard({ game, userId, isAuthenticated, prediction }: GameCardProps) {
  const [showPredictionDialog, setShowPredictionDialog] = useState(false);
  const [showInsightsDialog, setShowInsightsDialog] = useState(false);

  return (
    <>
      <Card className="hover:shadow-md transition-all duration-300">
        <CardContent className="pt-6">
          <GameInfo game={game} prediction={prediction} />
          
          <div className="mt-6 space-y-3">
            <PredictionButton
              gameId={game.id}
              userId={userId}
              isAuthenticated={isAuthenticated}
              prediction={prediction}
              gameDate={game.game_date}
              onPrediction={() => setShowPredictionDialog(true)}
              homeTeam={game.home_team}
              awayTeam={game.away_team}
            />
            
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => setShowInsightsDialog(true)}
            >
              <Eye className="h-4 w-4" />
              How Others Predict
            </Button>
          </div>
        </CardContent>
      </Card>

      <PredictionDialog
        isOpen={showPredictionDialog}
        onOpenChange={setShowPredictionDialog}
        gameId={game.id}
        userId={userId}
        gameDate={game.game_date}
        homeTeam={game.home_team}
        awayTeam={game.away_team}
      />

      <PredictionInsightsDialog
        isOpen={showInsightsDialog}
        onOpenChange={setShowInsightsDialog}
        gameId={game.id}
      />
    </>
  );
}