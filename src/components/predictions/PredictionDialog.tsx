import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PredictionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  userId?: string;
  gameDate: string;
  homeTeam: {
    id: string;
    name: string;
    logo_url: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo_url: string;
  };
}

export function PredictionDialog({ 
  isOpen, 
  onOpenChange, 
  gameId, 
  userId, 
  gameDate,
  homeTeam,
  awayTeam 
}: PredictionDialogProps) {
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!homeTeam || !awayTeam) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!homeScore || !awayScore) {
      return;
    }

    const homeScoreNum = parseInt(homeScore);
    const awayScoreNum = parseInt(awayScore);

    if (isNaN(homeScoreNum) || isNaN(awayScoreNum)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for existing prediction
      const { data: existingPrediction } = await supabase
        .from("predictions")
        .select("id")
        .eq("user_id", userId)
        .eq("game_id", gameId)
        .maybeSingle();

      if (existingPrediction) {
        setIsSubmitting(false);
        onOpenChange(false);
        return;
      }

      // Create new prediction
      const { error } = await supabase
        .from("predictions")
        .insert({
          user_id: userId,
          game_id: gameId,
          prediction_home_score: homeScoreNum,
          prediction_away_score: awayScoreNum,
        });

      if (error) throw error;
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting prediction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make Prediction</DialogTitle>
          <DialogDescription>
            {homeTeam.name} vs {awayTeam.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Submit Prediction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
