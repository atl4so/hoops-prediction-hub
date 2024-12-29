import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  // Query to check existing prediction
  const { data: existingPrediction } = useQuery({
    queryKey: ['prediction', gameId, userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("game_id", gameId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking existing prediction:', error);
        throw error;
      }
      return data;
    },
    enabled: !!userId && !!gameId,
  });

  const prediction = existingPrediction || initialPrediction;

  const submitPrediction = async (homeScore: number, awayScore: number) => {
    if (!userId || !gameId) return;
    
    setIsSubmitting(true);

    try {
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

      // Update cache for both queries
      queryClient.setQueryData(['prediction', gameId, userId], data);
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