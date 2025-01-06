import { Button } from "@/components/ui/button";
import { subHours, isBefore } from "date-fns";
import { toast } from "sonner";

interface PredictionButtonProps {
  isAuthenticated: boolean;
  gameDate: string;
  onPrediction: () => void;
  gameId: string;
  userId?: string;
  prediction?: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  } | null;
  homeTeam: {
    name: string;
    logo_url: string;
  };
  awayTeam: {
    name: string;
    logo_url: string;
  };
}

export function PredictionButton({ 
  isAuthenticated, 
  gameDate, 
  gameId, 
  userId,
  prediction,
  homeTeam,
  awayTeam,
  onPrediction 
}: PredictionButtonProps) {
  const isPredictionAllowed = () => {
    if (prediction) {
      return false;
    }

    const gameDateObj = new Date(gameDate);
    const now = new Date();
    const oneHourBefore = subHours(gameDateObj, 1);
    
    return isBefore(now, oneHourBefore);
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

    if (!isPredictionAllowed()) {
      toast.error("Predictions are closed 1 hour before the game starts");
      return;
    }

    onPrediction();
  };

  const getButtonText = () => {
    if (prediction) {
      return "Prediction Submitted";
    }
    return isPredictionAllowed() ? "Make Prediction" : "Predictions Closed";
  };

  return (
    <Button 
      onClick={handleClick}
      className="w-full shadow-sm transition-all duration-300"
      disabled={!isPredictionAllowed()}
    >
      {getButtonText()}
    </Button>
  );
}