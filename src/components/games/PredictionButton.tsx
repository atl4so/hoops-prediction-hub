import { Button } from "@/components/ui/button";
import { subHours, isBefore } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          console.log('Prediction changed:', payload);
          // Invalidate and refetch the prediction query
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
    // If game has a final result, don't allow predictions
    if (gameResult?.is_final) {
      return false;
    }

    // If user already has a prediction, don't allow another one
    if (existingPrediction) {
      return false;
    }

    const gameDateObj = new Date(gameDate);
    const now = new Date();
    const oneHourBefore = subHours(gameDateObj, 1);
    
    // For debugging
    console.log('Game date:', gameDateObj);
    console.log('Current time:', now);
    console.log('One hour before:', oneHourBefore);
    
    // Allow predictions if:
    // 1. Current time is before the game start time AND
    // 2. Current time is before the cutoff time (1 hour before game)
    const isBeforeGame = isBefore(now, gameDateObj);
    const isBeforeCutoff = isBefore(now, oneHourBefore);
    
    console.log('Is before game:', isBeforeGame);
    console.log('Is before cutoff:', isBeforeCutoff);
    console.log('Is prediction allowed:', isBeforeGame && isBeforeCutoff);
    
    return isBeforeGame && isBeforeCutoff;
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to make predictions",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (existingPrediction) {
      toast({
        title: "Prediction exists",
        description: "You have already made a prediction for this game",
        variant: "destructive",
      });
      return;
    }

    if (gameResult?.is_final) {
      toast({
        title: "Game completed",
        description: "This game has ended and predictions are closed",
        variant: "destructive",
      });
      return;
    }

    if (!isPredictionAllowed()) {
      toast({
        title: "Predictions closed",
        description: "Predictions are closed 1 hour before the game starts",
        variant: "destructive",
      });
      return;
    }

    onPrediction();
  };

  const getButtonText = () => {
    if (existingPrediction) {
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
        isPredictionAllowed() && !existingPrediction
          ? "bg-primary/90 hover:bg-primary" 
          : "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
      }`}
      disabled={!isPredictionAllowed() || !!existingPrediction || gameResult?.is_final}
      variant={isPredictionAllowed() && !existingPrediction ? "default" : "secondary"}
    >
      {getButtonText()}
    </Button>
  );
}