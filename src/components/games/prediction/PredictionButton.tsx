import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PredictionForm } from "./PredictionForm";

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
  const [showForm, setShowForm] = useState(false);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !gameId) return;
    
    const homeScoreNum = parseInt(homeScore);
    const awayScoreNum = parseInt(awayScore);

    if (isNaN(homeScoreNum) || isNaN(awayScoreNum)) {
      toast.error("Please enter valid scores");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("predictions")
        .insert({
          user_id: userId,
          game_id: gameId,
          prediction_home_score: homeScoreNum,
          prediction_away_score: awayScoreNum,
        });

      if (error) throw error;

      toast.success("Prediction submitted successfully!");
      setShowForm(false);
      setHomeScore("");
      setAwayScore("");
    } catch (error) {
      console.error('Error submitting prediction:', error);
      toast.error("Failed to submit prediction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          homeScore={homeScore}
          awayScore={awayScore}
          onHomeScoreChange={setHomeScore}
          onAwayScoreChange={setAwayScore}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}