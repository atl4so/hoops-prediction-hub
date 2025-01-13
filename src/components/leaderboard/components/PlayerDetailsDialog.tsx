import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    ppg?: number;
    efficiency?: number;
    underdog_picks?: number;
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

  const StatCard = ({ title, value, description }: { title: string; value: string | number; description: string }) => (
    <Card className="p-4 space-y-2 bg-muted/50">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Card>
  );

  const calculateWinnerPercentage = () => {
    if (!player.winner_predictions_correct || !player.winner_predictions_total) return 0;
    return Math.round((player.winner_predictions_correct / player.winner_predictions_total) * 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl h-[90vh] flex flex-col">
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
        
        <ScrollArea className="flex-1 px-1">
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard 
                title="Total Points" 
                value={player.total_points}
                description="Total points earned from all predictions"
              />
              <StatCard 
                title="Points per Game" 
                value={player.ppg?.toFixed(1) || '0.0'}
                description="Average points earned per prediction"
              />
              <StatCard 
                title="Correct Winners" 
                value={`${player.winner_predictions_correct || 0} / ${player.winner_predictions_total || 0}`}
                description="Number of times correctly predicted the winning team"
              />
              <StatCard 
                title="Winner %" 
                value={`${calculateWinnerPercentage()}%`}
                description="Percentage of correct winner predictions"
              />
              <StatCard 
                title="Efficiency" 
                value={player.efficiency?.toFixed(1) || '0.0'}
                description="Points weighted by prediction accuracy"
              />
              <StatCard 
                title="Underdogs" 
                value={player.underdog_picks || 0}
                description="Successful predictions against majority picks"
              />
              <StatCard 
                title="Total Predictions" 
                value={player.total_predictions}
                description="Total number of predictions made"
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
                          "text-sm p-3 rounded-md",
                          isCorrect ? "text-green-600 bg-green-50 dark:bg-green-950/30" : "text-red-600 bg-red-50 dark:bg-red-950/30"
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <span>{game.game.home_team.name} vs {game.game.away_team.name}</span>
                          <span className="font-medium">
                            {game.prediction_home_score} - {game.prediction_away_score}
                          </span>
                        </div>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}