import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
  isOpen: boolean;  // Changed from 'open' to 'isOpen' to match existing usage
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
  const { toast } = useToast();

  if (!homeTeam || !awayTeam) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!homeScore || !awayScore) {
      toast({
        title: "Error",
        description: "Please enter both scores",
        variant: "destructive",
      });
      return;
    }

    const homeScoreNum = parseInt(homeScore);
    const awayScoreNum = parseInt(awayScore);

    if (isNaN(homeScoreNum) || isNaN(awayScoreNum)) {
      toast({
        title: "Error",
        description: "Scores must be valid numbers",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // First, check if a prediction already exists
    const { data: existingPrediction } = await supabase
      .from("predictions")
      .select("id")
      .eq("user_id", userId)
      .eq("game_id", gameId)
      .maybeSingle();

    if (existingPrediction) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "You have already made a prediction for this game",
        variant: "destructive",
      });
      onOpenChange(false);
      return;
    }

    // If no existing prediction, create a new one
    const { error } = await supabase
      .from("predictions")
      .insert({
        user_id: userId,
        game_id: gameId,
        prediction_home_score: homeScoreNum,
        prediction_away_score: awayScoreNum,
      });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit prediction. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Your prediction has been submitted!",
    });
    onOpenChange(false);
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