import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import type { RoundRank } from "@/types/supabase";

export function useCurrentRoundRank(userId?: string) {
  const [currentRoundRank, setCurrentRoundRank] = useState<RoundRank | null>(null);

  const { data: rounds } = useQuery({
    queryKey: ["rounds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rounds")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    async function findLatestRoundWithFinishedGames() {
      if (!rounds?.length || !userId) return;

      for (const round of rounds) {
        // Check if the round has any finished games
        const { data: finishedGames } = await supabase
          .from('games')
          .select('id, game_results!inner(is_final)')
          .eq('round_id', round.id)
          .eq('game_results.is_final', true)
          .limit(1);

        if (finishedGames?.length) {
          // Get rankings for this round
          const { data: rankings } = await supabase
            .rpc('get_round_rankings', { round_id: round.id });

          if (rankings?.length) {
            const userRanking = rankings.find(r => r.user_id === userId);
            const rank = rankings.findIndex(r => r.user_id === userId) + 1;

            if (rank > 0) {
              setCurrentRoundRank({
                rank,
                roundId: round.id,
                roundName: round.name,
                isCurrent: true
              });
              break;
            }
          }
        }
      }
    }

    findLatestRoundWithFinishedGames();
  }, [rounds, userId]);

  return currentRoundRank;
}