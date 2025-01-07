import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Prediction {
  prediction_home_score: number;
  prediction_away_score: number;
  points_earned?: number;
}

export function usePredictionState(gameId: string, userId?: string, initialPrediction?: Prediction) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | undefined>(initialPrediction);
  const queryClient = useQueryClient();

  const submitPrediction = async (homeScore: number, awayScore: number) => {
    if (!userId || !gameId) return;
    
    setIsSubmitting(true);

    try {
      const { data: existingPrediction } = await supabase
        .from("predictions")
        .select("id")
        .eq("user_id", userId)
        .eq("game_id", gameId)
        .maybeSingle();

      if (existingPrediction) {
        toast.error("You have already made a prediction for this game");
        setShowForm(false);
        return;
      }

      const { data, error } = await supabase
        .from("predictions")
        .insert({
          user_id: userId,
          game_id: gameId,
          prediction_home_score: homeScore,
          prediction_away_score: awayScore,
        })
        .select()
        .single();

      if (error) throw error;

      setPrediction({
        prediction_home_score: homeScore,
        prediction_away_score: awayScore
      });

      queryClient.invalidateQueries({ queryKey: ['prediction', gameId, userId] });
      queryClient.invalidateQueries({ queryKey: ['userPredictions'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });

      toast.success("Prediction submitted successfully!");
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting prediction:', error);
      toast.error("Failed to submit prediction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showForm,
    setShowForm,
    isSubmitting,
    prediction,
    submitPrediction
  };
}