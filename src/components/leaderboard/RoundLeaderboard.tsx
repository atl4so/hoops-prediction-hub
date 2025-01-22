import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeaderboardRow } from "./LeaderboardRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { LeaderboardHeader } from "./components/LeaderboardHeader";
import { useLeaderboardSort } from "./hooks/useLeaderboardSort";

interface RoundLeaderboardProps {
  selectedRound: string;
}

export function RoundLeaderboard({ selectedRound }: RoundLeaderboardProps) {
  const { sortField, sortDirection, handleSort, sortData } = useLeaderboardSort();

  const { data: rankings, isLoading } = useQuery({
    queryKey: ["roundRankings", selectedRound],
    queryFn: async () => {
      const { data: roundStats, error } = await supabase
        .from('round_user_stats')
        .select(`
          user_id,
          total_points,
          total_predictions,
          winner_predictions_correct,
          winner_predictions_total,
          efficiency_rating,
          underdog_prediction_rate,
          user:profiles!round_user_stats_user_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq('round_id', selectedRound);

      if (error) throw error;

      return roundStats.map((stat: any) => ({
        user_id: stat.user_id,
        display_name: stat.user.display_name,
        avatar_url: stat.user.avatar_url,
        total_points: stat.total_points,
        total_predictions: stat.total_predictions,
        ppg: stat.total_predictions > 0 ? (stat.total_points / stat.total_predictions) : 0,
        efficiency: stat.efficiency_rating,
        underdog_picks: Math.round(stat.underdog_prediction_rate * stat.total_predictions / 100),
        winner_predictions_correct: stat.winner_predictions_correct,
        winner_predictions_total: stat.winner_predictions_total
      }));
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

  const sortedData = sortData(rankings || []);

  return (
    <Card className="w-full overflow-hidden border-2 bg-card/50 backdrop-blur-sm">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <LeaderboardHeader 
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </TableHeader>
          <TableBody>
            {sortedData.map((player: any, index: number) => (
              <LeaderboardRow
                key={player.user_id}
                player={player}
                rank={index + 1}
                index={index}
                isRoundLeaderboard={true}
                roundId={selectedRound}
              />
            ))}
            {!sortedData?.length && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
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