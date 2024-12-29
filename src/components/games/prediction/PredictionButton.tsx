import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { subHours, isBefore } from "date-fns";
import { PredictionForm } from "./PredictionForm";
import { useQueryClient } from "@tanstack/react-query";

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
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localPrediction, setLocalPrediction] = useState(initialPrediction);
  const queryClient = useQueryClient();

  const isPredictionAllowed = () => {
    if (gameResult?.is_final || localPrediction) {
      return false;
    }

    const gameDateObj = new Date(gameDate);
    const now = new Date();
    const oneHourBefore = subHours(gameDateObj, 1);
    
    return isBefore(now, oneHourBefore);
  };

  const handleSubmit = async (homeScore: number, awayScore: number) => {
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

      // Immediately update local state
      setLocalPrediction({
        prediction_home_score: homeScore,
        prediction_away_score: awayScore
      });

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

  const getButtonText = () => {
    if (localPrediction) {
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

    if (localPrediction) {
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
        disabled={!isPredictionAllowed() || !!localPrediction}
      >
        {getButtonText()}
      </Button>

      {showForm && isPredictionAllowed() && !localPrediction && (
        <PredictionForm
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}