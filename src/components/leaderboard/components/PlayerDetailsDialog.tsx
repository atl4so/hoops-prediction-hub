import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PlayerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: {
    user_id?: string;
    display_name: string;
    avatar_url?: string;
    total_points: number;
    total_predictions: number;
    winner_predictions_correct?: number;
    winner_predictions_total?: number;
    efficiency_rating?: number;
    underdog_prediction_rate?: number;
  };
  rank: number;
  isRoundLeaderboard?: boolean;
  roundId?: string;
}

export function PlayerDetailsDialog({
  open,
  onOpenChange,
  player,
  rank,
  isRoundLeaderboard = false,
  roundId
}: PlayerDetailsDialogProps) {
  const { data: roundDetails } = useQuery({
    queryKey: ["roundDetails", roundId, player.user_id],
    queryFn: async () => {
      if (!roundId || !player.user_id) return null;
      
      const { data } = await supabase
        .from('round_user_stats')
        .select(`
          total_points,
          total_predictions,
          finished_games,
          winner_predictions_correct,
          winner_predictions_total,
          efficiency_rating,
          underdog_prediction_rate,
          round:rounds!round_user_stats_round_id_fkey (
            name
          )
        `)
        .eq('round_id', roundId)
        .eq('user_id', player.user_id)
        .single();
      
      return data;
    },
    enabled: isRoundLeaderboard && !!roundId && !!player.user_id
  });

  const calculatePercentage = (correct?: number, total?: number) => {
    if (!correct || !total) return 0;
    return Math.round((correct / total) * 100);
  };

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
          <DialogTitle>
            {isRoundLeaderboard && roundDetails 
              ? `${player.display_name}'s Performance - ${roundDetails.round.name}`
              : 'Player Details'
            }
          </DialogTitle>
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
            {isRoundLeaderboard && roundDetails ? (
              <>
                <StatCard 
                  title="Efficiency Rating" 
                  value={`${Math.round(roundDetails.efficiency_rating)}%`}
                />
                <StatCard 
                  title="Underdog Rate" 
                  value={`${Math.round(roundDetails.underdog_prediction_rate)}%`}
                />
                <StatCard 
                  title="Winner Accuracy" 
                  value={`${calculatePercentage(roundDetails.winner_predictions_correct, roundDetails.winner_predictions_total)}%`}
                  subtitle={`${roundDetails.winner_predictions_correct} of ${roundDetails.winner_predictions_total}`}
                />
              </>
            ) : (
              <>
                <StatCard 
                  title="Winner %" 
                  value={`${winnerPercentage}%`}
                  subtitle={`${player.winner_predictions_correct || 0} of ${player.winner_predictions_total || 0}`}
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