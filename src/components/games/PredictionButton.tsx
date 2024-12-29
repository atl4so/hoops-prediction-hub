import { Button } from "@/components/ui/button";
import { subHours, isBefore } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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
  const queryClient = useQueryClient();
  const [hasPredicted, setHasPredicted] = useState(!!prediction);

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

  // Update local state when prediction data changes
  useEffect(() => {
    setHasPredicted(!!existingPrediction || !!prediction);
  }, [existingPrediction, prediction]);

  // Set up real-time subscription
  useEffect(() => {
    if (!userId || !gameId) return;

    console.log('Setting up real-time subscription for predictions');
    
    const channel = supabase
      .channel('prediction-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions',
          filter: `game_id=eq.${gameId} AND user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Prediction changed:', payload);
          setHasPredicted(true);
          queryClient.invalidateQueries({ queryKey: ['prediction', gameId, userId] });
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [gameId, userId, queryClient]);

  const isPredictionAllowed = () => {
    if (gameResult?.is_final || hasPredicted) {
      return false;
    }

    const gameDateObj = new Date(gameDate);
    const now = new Date();
    const oneHourBefore = subHours(gameDateObj, 1);
    
    const isBeforeGame = isBefore(now, gameDateObj);
    const isBeforeCutoff = isBefore(now, oneHourBefore);
    
    return isBeforeGame && isBeforeCutoff;
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to make predictions");
      navigate("/login");
      return;
    }

    if (hasPredicted) {
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
    if (hasPredicted) {
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
      className={`w-full shadow-sm transition-all duration-300 font-medium tracking-wide ${
        isPredictionAllowed() && !hasPredicted
          ? "bg-primary/90 hover:bg-primary" 
          : "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
      }`}
      disabled={!isPredictionAllowed() || hasPredicted || gameResult?.is_final}
      variant={isPredictionAllowed() && !hasPredicted ? "default" : "secondary"}
    >
      {getButtonText()}
    </Button>
  );
}