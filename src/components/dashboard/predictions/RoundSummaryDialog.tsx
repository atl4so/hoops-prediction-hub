import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { PredictionsPreview } from "../PredictionsPreview";

interface RoundSummaryDialogProps {
  roundName: string;
  userName: string;
  predictions: Array<{
    game: {
      game_date: string;
      home_team: {
        name: string;
        logo_url: string;
      };
      away_team: {
        name: string;
        logo_url: string;
      };
      game_results?: Array<{
        home_score: number;
        away_score: number;
        is_final: boolean;
      }>;
    };
    prediction: {
      prediction_home_score: number;
      prediction_away_score: number;
      points_earned?: number;
    };
  }>;
}

export function RoundSummaryDialog({ roundName, userName, predictions }: RoundSummaryDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Share2 className="h-4 w-4 mr-2" />
          Share Round
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Round {roundName} Summary</DialogTitle>
        </DialogHeader>
        <div className="mt-4 bg-white rounded-lg overflow-hidden">
          <PredictionsPreview
            userName={userName}
            roundName={roundName}
            predictions={predictions}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}