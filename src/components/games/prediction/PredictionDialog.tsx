import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PredictionForm } from "./PredictionForm";

interface PredictionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make Your Prediction</DialogTitle>
        </DialogHeader>
        <PredictionForm
          gameId={gameId}
          userId={userId}
          gameDate={gameDate}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}