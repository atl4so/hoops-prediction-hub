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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Final Result</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {format(new Date(result.game_date), "PPP")}
            </p>
            <p className="font-medium">
              {result.home_team.name} vs {result.away_team.name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="homeScore" className="text-sm text-muted-foreground block mb-2">
                {result.home_team.name} Score
              </label>
              <Input
                id="homeScore"
                type="number"
                value={homeScore}
                onChange={(e) => onHomeScoreChange(e.target.value)}
                placeholder="Home Score"
              />
            </div>
            <div>
              <label htmlFor="awayScore" className="text-sm text-muted-foreground block mb-2">
                {result.away_team.name} Score
              </label>
              <Input
                id="awayScore"
                type="number"
                value={awayScore}
                onChange={(e) => onAwayScoreChange(e.target.value)}
                placeholder="Away Score"
              />
            </div>
          </div>

          <Button 
            className="w-full"
            onClick={onUpdate}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Set Final Result"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}