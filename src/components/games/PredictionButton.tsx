import { Button } from "@/components/ui/button";
import { subHours, isBefore } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  };
  gameResult?: {
    home_score: number;
    away_score: number;
    is_final: boolean;
  };
}

export function PredictionButton({ 
  isAuthenticated, 
  gameDate, 
  onPrediction, 
  gameId, 
  userId,
  prediction,
  gameResult
}: PredictionButtonProps) {
  const navigate = useNavigate();

  // Query to check if user already has a prediction for this game
  const { data: existingPrediction } = useQuery({
    queryKey: ['prediction', gameId, userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('game_id', gameId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking existing prediction:', error);
        throw error;
      }
      return data;
    },
    enabled: !!userId && !!gameId,
  });

  const isPredictionAllowed = () => {
    if (gameResult?.is_final || prediction || existingPrediction) {
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
      navigate("/login");
      return;
    }

    if (prediction || existingPrediction) {
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

    onPrediction();
  };

  const getButtonText = () => {
    if (prediction || existingPrediction) {
      return "Prediction Submitted";
    }
    if (gameResult?.is_final) {
      return "Game Completed";
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