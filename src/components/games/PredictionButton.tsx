import { subHours, isBefore } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  // Query to check if user already has a prediction for this game
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
    if (prediction || existingPrediction) {
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
        disabled={!isPredictionAllowed()}
      >
        {getButtonText()}
      </Button>

      {showForm && isPredictionAllowed() && (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-background shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="homeScore">{homeTeam.name}</Label>
              <Input
                id="homeScore"
                type="number"
                min="0"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                placeholder="Score"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="awayScore">{awayTeam.name}</Label>
              <Input
                id="awayScore"
                type="number"
                min="0"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                placeholder="Score"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}