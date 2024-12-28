import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/types/supabase";

export function useCurrentRoundRank(userId: string | null) {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();

  return useQuery({
    queryKey: ['currentRoundRank', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Get the current round
      const { data: currentRound } = await supabase
        .from('rounds')
        .select('id')
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(1)
        .single();

      if (!currentRound) return null;

      // Get rankings for the current round
      const { data: roundRankings } = await supabase
        .rpc('get_round_rankings', {
          round_id: currentRound.id
        });

      if (!roundRankings) return null;

      // Find user's rank in the current round
      const rank = roundRankings.findIndex(r => r.user_id === userId) + 1;
      return rank || null;
    },
    enabled: !!userId && !!session
  });
}