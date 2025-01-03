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
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function AllTimeLeaderboard() {
  const isMobile = useIsMobile();
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
          winner_predictions_correct,
          winner_predictions_total,
          predictions:predictions(
            points_earned,
            game:games(
              game_results(is_final)
            )
          )
        `)
        .gt('total_predictions', 0)
        .gt('total_points', 0)
        .order('total_points', { ascending: false });

      if (profileError) throw profileError;
      
      return profileData || [];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 sm:h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isMobile && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          <p>Tap on a player to view detailed statistics</p>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-md border bg-card"
      >
        <div className="w-full overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70px] py-2">Rank</TableHead>
                <TableHead className="py-2">Player</TableHead>
                <TableHead className="text-right py-2">Points</TableHead>
                <TableHead className="text-right py-2 hidden sm:table-cell">PPG</TableHead>
                <TableHead className="text-right py-2 hidden sm:table-cell">Winners</TableHead>
                <TableHead className="text-right py-2">Games</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings?.map((player, index) => (
                <LeaderboardRow
                  key={player.id}
                  player={{
                    ...player,
                    winner_percentage: player.winner_predictions_total > 0
                      ? Math.round((player.winner_predictions_correct / player.winner_predictions_total) * 100)
                      : 0
                  }}
                  rank={index + 1}
                  index={index}
                />
              ))}
              {!rankings?.length && (
                <TableRow>
                  <TableCell colSpan={6} className="h-20 sm:h-24 text-center text-sm sm:text-base">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}