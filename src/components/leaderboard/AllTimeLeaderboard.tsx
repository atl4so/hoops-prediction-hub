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
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardRow } from "./LeaderboardRow";
import { motion } from "framer-motion";

const USERS_PER_PAGE = 50;

export function AllTimeLeaderboard() {
  const { data: rankings, isLoading } = useQuery({
    queryKey: ["leaderboard", "all-time"],
    queryFn: async () => {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, total_points, points_per_game')
        .order('total_points', { ascending: false })
        .limit(USERS_PER_PAGE);

      if (profileError) throw profileError;
      
      return (profileData || [])
        .filter(player => player.total_points > 0)
        .map(player => ({
          ...player,
          user_id: player.id,
          total_games: 0,
          finished_games: 0
        }));
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-md border bg-card"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="text-right">PPG</TableHead>
            <TableHead className="text-right">Games</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankings?.map((player, index) => (
            <LeaderboardRow
              key={player.user_id}
              player={player}
              rank={index + 1}
              index={index}
            />
          ))}
          {!rankings?.length && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}