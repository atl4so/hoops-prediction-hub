import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import type { RoundRank } from "@/types/supabase";

export function useCurrentRoundRank(userId?: string) {
  const [currentRoundRank, setCurrentRoundRank] = useState<RoundRank | undefined>();

  const { data: finishedGames } = useQuery({
    queryKey: ["finished-games"],
    queryFn: async () => {
      console.log('Fetching finished games...');
      
      const { data, error } = await supabase
        .from('games')
        .select(`
          id,
          round:rounds (
            id,
            name
          )
        `)
        .eq('round_id', '885518d1-d7c8-4523-9bd7-68e6608f9357')
        .limit(1);

      if (error) {
        console.error('Error fetching finished games:', error);
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (finishedGames && finishedGames.length > 0) {
      const roundData = finishedGames[0].round;
      
      setCurrentRoundRank({
        rank: 0, // This will be calculated elsewhere
        roundId: roundData.id,
        roundName: roundData.name,
        isCurrent: true
      });
    }
  }, [finishedGames]);

  return currentRoundRank;
}