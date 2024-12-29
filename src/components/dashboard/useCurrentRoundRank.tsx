import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

export function useCurrentRoundRank(userId: string | null) {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();

  return useQuery({
    queryKey: ['currentRoundRank', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Get the current round
      const { data: currentRound, error: roundError } = await supabase
        .from('rounds')
        .select('id')
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(1)
        .maybeSingle();  // Changed from .single() to .maybeSingle()

      if (roundError) {
        console.error('Error fetching current round:', roundError);
        return null;
      }

      // If no current round exists, return null
      if (!currentRound) {
        console.log('No current round found');
        return null;
      }

      // Get rankings for the current round
      const { data: roundRankings, error } = await supabase
        .rpc('get_round_rankings', {
          round_id: currentRound.id
        });

      if (error) {
        console.error('Error fetching round rankings:', error);
        return null;
      }

      if (!roundRankings || roundRankings.length === 0) {
        console.log('No rankings found for current round');
        return null;
      }

      // Find user's rank in the current round
      const userRankIndex = roundRankings.findIndex(r => r.user_id === userId);
      return userRankIndex !== -1 ? userRankIndex + 1 : null;
    },
    enabled: !!userId && !!session
  });
}