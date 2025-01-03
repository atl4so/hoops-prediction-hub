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
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { RoundSelector } from "@/components/ui/round-selector";

export function RoundLeaderboard() {
  const [selectedRound, setSelectedRound] = useState("");
  const ITEMS_PER_PAGE = 50;
  const [page, setPage] = useState(1);
  const startRange = (page - 1) * ITEMS_PER_PAGE;
  const endRange = startRange + ITEMS_PER_PAGE - 1;

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url');

      if (error) throw error;
      return data;
    },
  });

  const { data: rankings, isLoading } = useQuery({
    queryKey: ["leaderboard", "round", selectedRound, page],
    queryFn: async () => {
      if (!selectedRound) return [];

      // Get all predictions for the round to show total games predicted
      const { data: totalPredictions, error: totalError } = await supabase
        .from('predictions')
        .select('user_id, games!inner(round_id)')
        .eq('games.round_id', selectedRound);

      if (totalError) throw totalError;

      // Get finished predictions to show completed games
      const { data: finishedPredictions, error: finishedError } = await supabase
        .from('predictions')
        .select('user_id, games!inner(is_finished, round_id)')
        .eq('games.is_finished', true)
        .eq('games.round_id', selectedRound);

      if (finishedError) throw finishedError;

      // Count predictions per user
      const totalCounts = totalPredictions?.reduce((acc, { user_id }) => {
        acc[user_id] = (acc[user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const finishedCounts = finishedPredictions?.reduce((acc, { user_id }) => {
        acc[user_id] = (acc[user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const { data, error } = await supabase
        .rpc('get_round_rankings', { round_id: selectedRound })
        .range(startRange, endRange);

      if (error) throw error;

      // Filter out users with no points and map with user details
      const usersWithPoints = (data || [])
        .filter(player => player.total_points > 0)
        .map(player => {
          const userDetails = users?.find(u => u.id === player.user_id);
          return {
            ...player,
            display_name: userDetails?.display_name || 'Unknown',
            avatar_url: userDetails?.avatar_url,
            total_games: totalCounts?.[player.user_id] || 0,
            finished_games: finishedCounts?.[player.user_id] || 0
          };
        });

      return usersWithPoints;
    },
    enabled: !!selectedRound,
  });

  if (!selectedRound) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <Trophy className="w-12 h-12 text-primary/20" />
        <RoundSelector
          selectedRound={selectedRound}
          onRoundChange={setSelectedRound}
          className="w-full max-w-xs"
        />
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
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <RoundSelector
          selectedRound={selectedRound}
          onRoundChange={setSelectedRound}
          className="w-full max-w-xs"
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Avg/Game</TableHead>
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
      </div>
    </motion.div>
  );
}