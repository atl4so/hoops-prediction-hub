import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { subHours, isBefore } from "date-fns";

interface PredictionFormProps {
  userId?: string;
  gameDate: string;
  homeTeam: {
    name: string;
    logo_url: string;
  };
  awayTeam: {
    name: string;
    logo_url: string;
  };
  onCancel: () => void;
  gameId: string;
}

export function PredictionForm({
  gameId,
  userId,
  gameDate,
  homeTeam,
  awayTeam,
  onCancel
}: PredictionFormProps) {
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !gameId) return;
    
    const homeScoreNum = parseInt(homeScore);
    const awayScoreNum = parseInt(awayScore);

    if (isNaN(homeScoreNum) || isNaN(awayScoreNum)) {
      toast.error("Please enter valid scores");
      return;
    }

    const gameDateObj = new Date(gameDate);
    const now = new Date();
    const oneHourBefore = subHours(gameDateObj, 1);
    
    if (!isBefore(now, oneHourBefore)) {
      toast.error("Predictions are closed 1 hour before the game starts");
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
      onCancel();
    } catch (error) {
      console.error('Error submitting prediction:', error);
      toast.error("Failed to submit prediction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-background shadow-sm space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="homeScore" className="text-center">{homeTeam.name}</Label>
          <Input
            id="homeScore"
            type="number"
            min="0"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            placeholder="Score"
            required
            className="text-center"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="awayScore" className="text-center">{awayTeam.name}</Label>
          <Input
            id="awayScore"
            type="number"
            min="0"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            placeholder="Score"
            required
            className="text-center"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
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
  );
}