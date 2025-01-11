import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

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

  const StatCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
    <Card className="p-4 space-y-1">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </Card>
  );

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
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              title="Total Points" 
              value={player.total_points}
            />
            {!isRoundLeaderboard && (
              <>
                <StatCard 
                  title="Winner %" 
                  value={`${winnerPercentage}%`}
                  subtitle={`${player.winner_predictions_correct || 0} of ${player.winner_predictions_total || 0}`}
                />
                <StatCard 
                  title="Home Win %" 
                  value={`${homeWinPercentage}%`}
                  subtitle={`${player.home_winner_predictions_correct || 0} of ${player.home_winner_predictions_total || 0}`}
                />
                <StatCard 
                  title="Away Win %" 
                  value={`${awayWinPercentage}%`}
                  subtitle={`${player.away_winner_predictions_correct || 0} of ${player.away_winner_predictions_total || 0}`}
                />
              </>
            )}
            <StatCard 
              title="Predictions" 
              value={player.total_predictions}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}