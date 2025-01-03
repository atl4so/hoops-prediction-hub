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

export function AllTimeLeaderboard() {
  const { data: rankings, isLoading } = useQuery({
    queryKey: ["leaderboard", "all-time"],
    queryFn: async () => {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id, 
          display_name, 
          avatar_url, 
          total_points, 
          points_per_game,
          total_predictions,
          predictions:predictions(
            points_earned,
            game:games(
              game_results(is_final)
            )
          )
        `)
        .order('total_points', { ascending: false });

      if (profileError) throw profileError;
      
      return (profileData || [])
        .filter(player => player.total_points > 0)
        .map(player => ({
          ...player,
          user_id: player.id,
          finished_games: player.predictions?.filter(p => 
            p.game?.game_results?.[0]?.is_final && p.points_earned !== null
          ).length || 0,
          total_games: player.total_predictions || 0
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