import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
  prediction,
  gameResult,
  homeTeam,
  awayTeam
}: PredictionButtonProps) {
  const navigate = useNavigate();
  const {
    showForm,
    setShowForm,
    isSubmitting,
    prediction: localPrediction,
    submitPrediction
  } = usePredictionState(gameId, userId, prediction);

  const isPredictionAllowed = () => {
    if (gameResult?.is_final || prediction) {
      return false;
    }

    const gameDateObj = new Date(gameDate);
    const now = new Date();
    const oneHourBefore = new Date(gameDateObj.getTime() - (60 * 60 * 1000));
    
    return now < oneHourBefore;
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (prediction) {
      return;
    }

    if (gameResult?.is_final) {
      return;
    }

    if (!isPredictionAllowed()) {
      return;
    }

    setShowForm(true);
  };

  const getButtonText = () => {
    if (!isAuthenticated) {
      return "Log in to Predict";
    }
    if (prediction) {
      return "Prediction Submitted";
    }
    if (gameResult?.is_final) {
      return "Game Completed";
    }
    return isPredictionAllowed() ? "Make Prediction" : "Predictions Closed";
  };

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleClick}
        className="w-full shadow-sm transition-all duration-300"
        disabled={isAuthenticated && (!isPredictionAllowed() || !!prediction)}
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