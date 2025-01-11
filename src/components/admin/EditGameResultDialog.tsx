import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditGameResultDialogProps {
  result: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeScore: string;
  awayScore: string;
  onHomeScoreChange: (value: string) => void;
  onAwayScoreChange: (value: string) => void;
  onUpdate: () => void;
  isPending: boolean;
}

export function EditGameResultDialog({
  result,
  open,
  onOpenChange,
  homeScore,
  awayScore,
  onHomeScoreChange,
  onAwayScoreChange,
  onUpdate,
  isPending,
}: EditGameResultDialogProps) {
  if (!result) return null;

  const hasResult = result.game_results?.length > 0;
  const finalResult = hasResult ? result.game_results[0] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {finalResult ? 'Update Final Result' : 'Set Final Result'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {format(new Date(result.game_date), "PPP")}
            </p>
            <p className="font-medium">
              {result.home_team.name} vs {result.away_team.name}
            </p>
            {finalResult && (
              <p className="text-sm text-muted-foreground mt-1">
                Current result: {finalResult.home_score} - {finalResult.away_score}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Home Score"
              value={homeScore}
              onChange={(e) => onHomeScoreChange(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Away Score"
              value={awayScore}
              onChange={(e) => onAwayScoreChange(e.target.value)}
            />
          </div>

          <Button 
            className="w-full"
            onClick={onUpdate}
            disabled={isPending}
          >
            {isPending ? "Saving..." : (finalResult ? "Update Result" : "Set Final Result")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}