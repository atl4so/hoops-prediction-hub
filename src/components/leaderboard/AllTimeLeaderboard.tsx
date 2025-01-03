import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeaderboardRow } from "./LeaderboardRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function AllTimeLeaderboard() {
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
            avatar_url
          ),
          game:games!inner (
            id
          )
        `)
        .not('points_earned', 'is', null);

      if (error) throw error;

      // Aggregate user data
      const userStats = predictions.reduce((acc: any, pred) => {
        const userId = pred.user.id;
        if (!acc[userId]) {
          acc[userId] = {
            user_id: userId,
            display_name: pred.user.display_name,
            avatar_url: pred.user.avatar_url,
            total_points: 0,
            total_predictions: 0,
            points_per_game: 0
          };
        }
        acc[userId].total_predictions += 1;
        acc[userId].total_points += pred.points_earned || 0;
        return acc;
      }, {});

      // Calculate points per game and convert to array
      const leaderboard = Object.values(userStats).map((user: any) => ({
        ...user,
        points_per_game: user.total_predictions > 0 
          ? user.total_points / user.total_predictions 
          : 0
      }));

      // Sort by total points
      return leaderboard.sort((a: any, b: any) => b.total_points - a.total_points);
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

  return (
    <Card className="w-full overflow-hidden border-2 bg-card/50 backdrop-blur-sm">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-2">
              <TableHead className="w-20 font-bold text-base">Rank</TableHead>
              <TableHead className="font-bold text-base">Player</TableHead>
              <TableHead className="text-right font-bold text-base">Points</TableHead>
              <TableHead className="text-right hidden sm:table-cell font-bold text-base">PPG</TableHead>
              <TableHead className="text-right font-bold text-base">Games</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData?.map((player: any, index: number) => (
              <LeaderboardRow
                key={player.user_id}
                player={player}
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