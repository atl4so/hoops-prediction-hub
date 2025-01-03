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
            avatar_url
          ),
          game:games!inner (
            game_results!inner (
              is_final
            )
          )
        `)
        .eq('game.round_id', selectedRound)
        .eq('game.game_results.is_final', true)
        .not('points_earned', 'is', null);

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
            predictions_count: 0,
            finished_games: 0
          };
        }
        acc[userId].total_points += pred.points_earned || 0;
        acc[userId].predictions_count += 1;
        acc[userId].finished_games += pred.game.game_results[0].is_final ? 1 : 0;
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