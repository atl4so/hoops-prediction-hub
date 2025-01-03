import { Button } from "@/components/ui/button";
import { subHours, isBefore } from "date-fns";
import { toast } from "sonner";
import { PredictionForm } from "./PredictionForm";
import { usePredictionState } from "./usePredictionState";

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
  prediction: initialPrediction,
  gameResult,
  homeTeam,
  awayTeam
}: PredictionButtonProps) {
  const {
    showForm,
    setShowForm,
    isSubmitting,
    prediction,
    submitPrediction
  } = usePredictionState(gameId, userId, initialPrediction);

  const isPredictionAllowed = () => {
    if (gameResult?.is_final || prediction) {
      return false;
    }

    const gameDateObj = new Date(gameDate);
    const now = new Date();
    const oneHourBefore = subHours(gameDateObj, 1);
    
    return isBefore(now, oneHourBefore);
  };

  const getButtonText = () => {
    if (prediction) {
      return "Prediction Submitted";
    }
    if (gameResult?.is_final) {
      return "Game Completed";
    }
    return isPredictionAllowed() ? "Make Prediction" : "Predictions Closed";
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to make predictions");
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

    if (!isPredictionAllowed()) {
      toast.error("Predictions are closed 1 hour before the game starts");
      return;
    }

    setShowForm(true);
  };

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleClick}
        className="w-full shadow-sm transition-all duration-300"
        disabled={!isPredictionAllowed() || !!prediction}
      >
        {getButtonText()}
      </Button>

      {showForm && isPredictionAllowed() && !prediction && (
        <PredictionForm
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          onSubmit={submitPrediction}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}