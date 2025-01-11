import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
  const { data: roundGames, isLoading } = useQuery({
    queryKey: ["round-games", roundId, player.user_id],
    queryFn: async () => {
      if (!roundId || !player.user_id) return null;
      
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          prediction_home_score,
          prediction_away_score,
          game:games!inner (
            id,
            home_team:teams!games_home_team_id_fkey (name),
            away_team:teams!games_away_team_id_fkey (name),
            game_results (
              home_score,
              away_score
            )
          )
        `)
        .eq('user_id', player.user_id)
        .eq('game.round_id', roundId);

      if (error) {
        console.error('Error fetching round games:', error);
        return null;
      }
      
      return data;
    },
    enabled: isRoundLeaderboard && !!roundId && !!player.user_id
  });

  console.log('Round games data:', roundGames);

  const StatCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
    <Card className="p-4 space-y-1 bg-muted/50">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle>
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
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              title="Total Points" 
              value={player.total_points}
            />
            <StatCard 
              title="Winner" 
              value={`${Math.round((player.winner_predictions_correct || 0) / (player.winner_predictions_total || 1) * 100)}%`}
              subtitle={`${player.winner_predictions_correct || 0} of ${player.winner_predictions_total || 0}`}
            />
          </div>

          {isRoundLeaderboard && roundGames && roundGames.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Round Predictions</h4>
              <div className="space-y-2">
                {roundGames.map((game: any) => {
                  const gameResult = game.game.game_results?.[0];
                  if (!gameResult) return null;

                  const predictedHomeWin = game.prediction_home_score > game.prediction_away_score;
                  const actualHomeWin = gameResult.home_score > gameResult.away_score;
                  const isCorrect = predictedHomeWin === actualHomeWin;

                  return (
                    <div 
                      key={game.game.id} 
                      className={cn(
                        "text-sm py-2 px-3 rounded-md",
                        isCorrect ? "text-green-600 bg-green-50 dark:bg-green-950/30" : "text-red-600 bg-red-50 dark:bg-red-950/30"
                      )}
                    >
                      {game.game.home_team.name} vs {game.game.away_team.name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isRoundLeaderboard && isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              Loading predictions...
            </div>
          )}

          {isRoundLeaderboard && !isLoading && (!roundGames || roundGames.length === 0) && (
            <div className="text-center py-4 text-muted-foreground">
              No predictions found for this round
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}