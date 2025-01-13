import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody } from "@/components/ui/table";
import { LeaderboardRow } from "./LeaderboardRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { LeaderboardHeader } from "./components/LeaderboardHeader";
import { useLeaderboardSort } from "./hooks/useLeaderboardSort";

interface UserStats {
  user_id: string;
  efficiency_rating: number;
  underdog_prediction_rate: number;
}

interface UserPrediction {
  points_earned: number;
  user: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    winner_predictions_correct: number;
    winner_predictions_total: number;
    points_per_game: number;
  };
  game: {
    id: string;
  };
}

export function AllTimeLeaderboard() {
  const { sortField, sortDirection, handleSort, sortData } = useLeaderboardSort();

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["allTimeLeaderboard"],
    queryFn: async () => {
      const { data: predictions, error } = await supabase
        .from("predictions")
        .select(`
          points_earned,
          user:profiles!predictions_user_id_fkey (
            id,
            display_name,
            avatar_url,
            winner_predictions_correct,
            winner_predictions_total,
            points_per_game
          ),
          game:games!inner (
            id
          )
        `)
        .not('points_earned', 'is', null);

      if (error) throw error;

      const { data: roundStats, error: statsError } = await supabase
        .from("round_user_stats")
        .select('user_id, efficiency_rating, underdog_prediction_rate')
        .order('efficiency_rating', { ascending: false });

      if (statsError) throw statsError;

      const statsMap = (roundStats as UserStats[]).reduce((acc: Record<string, UserStats>, stat) => {
        if (!acc[stat.user_id]) {
          acc[stat.user_id] = stat;
        }
        return acc;
      }, {});

      const userIds = [...new Set(predictions.map((p: UserPrediction) => p.user.id))];

      const underdogResults = await Promise.all(
        userIds.map(userId =>
          supabase
            .rpc('get_user_all_time_underdog_picks', { user_id_param: userId })
            .single()
        )
      );

      const underdogMap = userIds.reduce((acc: Record<string, number>, userId, index) => {
        const result = underdogResults[index].data;
        acc[userId] = result?.total_underdog_picks || 0;
        return acc;
      }, {});

      const aggregatedStats = (predictions as UserPrediction[]).reduce((acc: Record<string, any>, pred) => {
        const userId = pred.user.id;
        if (!acc[userId]) {
          acc[userId] = {
            user_id: userId,
            display_name: pred.user.display_name,
            avatar_url: pred.user.avatar_url,
            total_points: 0,
            total_predictions: 0,
            ppg: pred.user.points_per_game,
            efficiency: statsMap[userId]?.efficiency_rating || 0,
            underdog_picks: underdogMap[userId] || 0,
            winner_predictions_correct: pred.user.winner_predictions_correct,
            winner_predictions_total: pred.user.winner_predictions_total
          };
        }
        acc[userId].total_predictions += 1;
        acc[userId].total_points += pred.points_earned || 0;
        return acc;
      }, {});

      return Object.values(aggregatedStats);
    }
  });

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

  const sortedData = sortData(leaderboardData || []);

  return (
    <Card className="w-full overflow-hidden border-2 bg-card/50 backdrop-blur-sm">
      <div className="w-full overflow-x-auto">
        <Table>
          <LeaderboardHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TableBody>
            {sortedData.map((player: any, index: number) => (
              <LeaderboardRow
                key={player.user_id}
                player={{
                  ...player,
                  ppg: player.ppg,
                  efficiency: player.efficiency,
                  underdog_picks: player.underdog_picks
                }}
                rank={index + 1}
                index={index}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}