import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePredictionState(
  gameId: string,
  userId?: string,
  initialPrediction?: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  }
) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState(initialPrediction);

  const submitPrediction = async (homeScore: number, awayScore: number) => {
    if (!userId || !gameId) return;
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("predictions")
        .insert({
          user_id: userId,
          game_id: gameId,
          prediction_home_score: homeScore,
          prediction_away_score: awayScore,
        });

      if (error) throw error;

      toast.success("Prediction submitted successfully!");
      setShowForm(false);
      setPrediction({
        prediction_home_score: homeScore,
        prediction_away_score: awayScore
      });
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