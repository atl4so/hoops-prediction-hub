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
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface RoundLeaderboardProps {
  selectedRound: string;
}

export function RoundLeaderboard({ selectedRound }: RoundLeaderboardProps) {
  const { data: rankings, isLoading } = useQuery({
    queryKey: ["leaderboard", "round", selectedRound],
    queryFn: async () => {
      if (!selectedRound) return [];

      const { data, error } = await supabase
        .from('predictions')
        .select(`
          user_id,
          points_earned,
          user:profiles!predictions_user_id_fkey (
            id,
            display_name,
            avatar_url,
            total_predictions
          ),
          game:games!inner (
            round_id,
            game_results!inner (
              is_final
            )
          )
        `)
        .eq('game.round_id', selectedRound);

      if (error) throw error;

      // Group and aggregate data by user
      const userStats = (data || []).reduce((acc, pred) => {
        const userId = pred.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            user_id: userId,
            display_name: pred.user.display_name,
            avatar_url: pred.user.avatar_url,
            total_points: 0,
            total_predictions: pred.user.total_predictions,
            finished_games: 0,
            round_predictions: 0
          };
        }
        acc[userId].round_predictions += 1;
        if (pred.game.game_results[0]?.is_final && pred.points_earned !== null) {
          acc[userId].total_points += pred.points_earned || 0;
          acc[userId].finished_games += 1;
        }
        return acc;
      }, {} as Record<string, any>);

      return Object.values(userStats)
        .sort((a, b) => b.total_points - a.total_points);
    },
    enabled: !!selectedRound,
  });

  if (!selectedRound) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <Trophy className="w-12 h-12 text-primary/20" />
        <p className="text-muted-foreground">Select a round to view rankings</p>
      </div>
    );
  }

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
              isRoundLeaderboard={true}
            />
          ))}
          {!rankings?.length && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}