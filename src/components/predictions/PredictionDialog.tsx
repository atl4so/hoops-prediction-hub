import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
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
  game: {
    id: string;
    home_team: { name: string };
    away_team: { name: string };
    game_date: string;
  };
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function PredictionDialog({ game, isOpen, onClose, userId }: PredictionDialogProps) {
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

    const { error } = await supabase
      .from("predictions")
      .insert({
        user_id: userId,
        game_id: game.id,
        prediction_home_score: homeScoreNum,
        prediction_away_score: awayScoreNum,
      });

    setIsSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Error",
          description: "You have already made a prediction for this game",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit prediction. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Success",
      description: "Your prediction has been submitted!",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make Prediction</DialogTitle>
          <DialogDescription>
            {game.home_team.name} vs {game.away_team.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="homeScore">{game.home_team.name}</Label>
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
              <Label htmlFor="awayScore">{game.away_team.name}</Label>
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
            <Button variant="outline" type="button" onClick={onClose}>
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