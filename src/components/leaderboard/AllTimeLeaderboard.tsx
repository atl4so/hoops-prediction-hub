import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardRow } from "./LeaderboardRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AllTimeLeaderboard() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          display_name,
          avatar_url,
          total_points,
          points_per_game,
          total_predictions
        `)
        .gt('total_points', 0)
        .order("total_points", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="text-right hidden md:table-cell">PPG</TableHead>
            <TableHead className="text-right hidden md:table-cell">Predictions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((player, index) => (
            <LeaderboardRow
              key={player.id}
              player={player}
              rank={index + 1}
              showFollowButton={false}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}