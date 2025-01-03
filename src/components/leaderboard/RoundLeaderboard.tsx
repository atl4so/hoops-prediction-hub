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
import { Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RoundSelector } from "@/components/ui/round-selector";

export function RoundLeaderboard() {
  const [selectedRound, setSelectedRound] = useState("");

  const { data: rankings, isLoading } = useQuery({
    queryKey: ["leaderboard", "round", selectedRound],
    queryFn: async () => {
      if (!selectedRound) return [];

      const { data, error } = await supabase
        .rpc('get_round_rankings', { round_id: selectedRound });

      if (error) throw error;
      return data || [];
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