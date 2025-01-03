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

interface RoundLeaderboardProps {
  selectedRound: string;
}

export function RoundLeaderboard({ selectedRound }: RoundLeaderboardProps) {
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
      <div className="flex flex-col items-center justify-center space-y-4 py-8 sm:py-12">
        <p className="text-sm sm:text-base text-muted-foreground">Select a round to view rankings</p>
      </div>
    );
  }

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-md border bg-card"
    >
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px] py-2">Rank</TableHead>
              <TableHead className="py-2">Player</TableHead>
              <TableHead className="text-right py-2">Points</TableHead>
              <TableHead className="text-right py-2">Games</TableHead>
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
                <TableCell colSpan={4} className="h-20 sm:h-24 text-center text-sm sm:text-base">
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