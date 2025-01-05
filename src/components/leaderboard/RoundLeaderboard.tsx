import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaderboardRow } from "./LeaderboardRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface RoundLeaderboardProps {
  selectedRound: string;
}

export function RoundLeaderboard({ selectedRound }: RoundLeaderboardProps) {
  const { data: rankings, isLoading } = useQuery({
    queryKey: ["roundRankings", selectedRound],
    queryFn: async () => {
      // Get round rankings with additional user stats
      const { data: roundData, error: rankingsError } = await supabase
        .rpc('get_round_rankings', {
          round_id: selectedRound
        });

      if (rankingsError) throw rankingsError;

      // Fetch additional stats for users
      const userIds = roundData.map((player: any) => player.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          avatar_url,
          winner_predictions_correct,
          winner_predictions_total,
          home_winner_predictions_correct,
          home_winner_predictions_total,
          away_winner_predictions_correct,
          away_winner_predictions_total
        `)
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Merge the data
      return roundData.map((player: any) => {
        const profile = profiles?.find((p: any) => p.id === player.user_id);
        return {
          ...player,
          avatar_url: profile?.avatar_url,
          winner_predictions_correct: profile?.winner_predictions_correct,
          winner_predictions_total: profile?.winner_predictions_total,
          home_winner_predictions_correct: profile?.home_winner_predictions_correct,
          home_winner_predictions_total: profile?.home_winner_predictions_total,
          away_winner_predictions_correct: profile?.away_winner_predictions_correct,
          away_winner_predictions_total: profile?.away_winner_predictions_total
        };
      });
    },
    enabled: !!selectedRound
  });

  if (!selectedRound) {
    return (
      <Card className="w-full p-8 text-center">
        <p className="text-muted-foreground">Select a round to view rankings</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full p-4 md:p-6">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden border-2 bg-card/50 backdrop-blur-sm">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-2">
              <TableHead className="w-20 font-bold text-base">Rank</TableHead>
              <TableHead className="font-bold text-base">Player</TableHead>
              <TableHead className="text-right font-bold text-base">Points</TableHead>
              <TableHead className="text-right font-bold text-base">Games</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings?.map((player: any, index: number) => (
              <LeaderboardRow
                key={player.user_id}
                player={{
                  user_id: player.user_id,
                  display_name: player.display_name,
                  total_points: player.total_points,
                  total_predictions: player.predictions_count,
                  avatar_url: player.avatar_url,
                  winner_predictions_correct: player.winner_predictions_correct,
                  winner_predictions_total: player.winner_predictions_total,
                  home_winner_predictions_correct: player.home_winner_predictions_correct,
                  home_winner_predictions_total: player.home_winner_predictions_total,
                  away_winner_predictions_correct: player.away_winner_predictions_correct,
                  away_winner_predictions_total: player.away_winner_predictions_total
                }}
                rank={index + 1}
                index={index}
                isRoundLeaderboard={true}
              />
            ))}
            {!rankings?.length && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No predictions found for this round
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}