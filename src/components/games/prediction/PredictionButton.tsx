import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { PredictionDialog } from "@/components/predictions/PredictionDialog";
import { PredictionInsightsDialog } from "./PredictionInsightsDialog";
import { FinishedGameInsightsDialog } from "./insights/FinishedGameInsightsDialog";

interface PredictionButtonProps {
  isAuthenticated: boolean;
  gameDate: string;
  gameId: string;
  userId?: string;
  prediction?: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  };
  gameResult?: {
    home_score: number;
    away_score: number;
    is_final: boolean;
  };
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
}

export function PredictionButton({
  isAuthenticated,
  gameDate,
  gameId,
  userId,
  prediction,
  gameResult,
  homeTeam,
  awayTeam
}: PredictionButtonProps) {
  const navigate = useNavigate();
  const [showPredictionDialog, setShowPredictionDialog] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const handlePredictionClick = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to make predictions");
      navigate("/login");
      return;
    }

    if (prediction) {
      toast.error("You have already made a prediction for this game");
      return;
    }

    if (gameResult?.is_final) {
      toast.error("This game has ended and predictions are closed");
      return;
    }

    const gameDateObj = new Date(gameDate);
    const now = new Date();
    const oneHourBefore = new Date(gameDateObj.getTime() - (60 * 60 * 1000));
    
    if (now >= oneHourBefore) {
      toast.error("Predictions are closed 1 hour before the game starts");
      return;
    }

    setShowPredictionDialog(true);
  };

  return (
    <div className="space-y-3">
      <Button 
        variant="default"
        className="w-full" 
        onClick={handlePredictionClick}
        disabled={!!prediction || !!gameResult?.is_final}
      >
        {prediction ? "Prediction Submitted" : 
         gameResult?.is_final ? "Game Completed" : 
         "Make Prediction"}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={() => setShowInsights(true)}
      >
        <Eye className="w-4 h-4 mr-2" />
        {gameResult?.is_final ? "How Others Predicted" : "How Others Predict"}
      </Button>

      <PredictionDialog
        isOpen={showPredictionDialog}
        onOpenChange={setShowPredictionDialog}
        gameId={gameId}
        gameDate={gameDate}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />

      {gameResult?.is_final ? (
        <FinishedGameInsightsDialog
          isOpen={showInsights}
          onOpenChange={setShowInsights}
          gameId={gameId}
          finalScore={{
            home: gameResult.home_score,
            away: gameResult.away_score
          }}
        />
      ) : (
        <PredictionInsightsDialog
          isOpen={showInsights}
          onOpenChange={setShowInsights}
          gameId={gameId}
        />
      )}
    </div>
  );
}