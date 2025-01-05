import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: {
    display_name: string;
    avatar_url?: string;
    total_points: number;
    total_predictions: number;
    home_winner_predictions_correct?: number;
    home_winner_predictions_total?: number;
    away_winner_predictions_correct?: number;
    away_winner_predictions_total?: number;
    winner_predictions_correct?: number;
    winner_predictions_total?: number;
  };
  rank: number;
  isRoundLeaderboard?: boolean;
}

export function PlayerDetailsDialog({
  open,
  onOpenChange,
  player,
  rank,
  isRoundLeaderboard = false
}: PlayerDetailsDialogProps) {
  const calculatePercentage = (correct?: number, total?: number) => {
    if (!correct || !total) return 0;
    return Math.round((correct / total) * 100);
  };

  const homeWinPercentage = calculatePercentage(player.home_winner_predictions_correct, player.home_winner_predictions_total);
  const awayWinPercentage = calculatePercentage(player.away_winner_predictions_correct, player.away_winner_predictions_total);
  const winnerPercentage = calculatePercentage(player.winner_predictions_correct, player.winner_predictions_total);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Player Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={player.avatar_url} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold">{player.display_name}</h3>
              <p className="text-sm text-muted-foreground">Rank {rank}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-2xl font-bold">{player.total_points}</p>
            </div>
            {!isRoundLeaderboard && (
              <>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Winner %</p>
                  <p className="text-2xl font-bold">{winnerPercentage}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Home Win %</p>
                  <p className="text-2xl font-bold">{homeWinPercentage}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Away Win %</p>
                  <p className="text-2xl font-bold">{awayWinPercentage}%</p>
                </div>
              </>
            )}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Predictions</p>
              <p className="text-2xl font-bold">{player.total_predictions}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}