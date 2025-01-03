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
        .select('id, name')
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (roundError) {
        console.error('Error fetching current round:', roundError);
        return null;
      }

      // If there's a current round, check if it has any finished games
      if (currentRound) {
        const { data: finishedGames, error: gamesError } = await supabase
          .from('games')
          .select('id')
          .eq('round_id', currentRound.id)
          .gt('game_results', '[]')
          .limit(1);

        if (gamesError) {
          console.error('Error fetching finished games:', gamesError);
          return null;
        }

        // If there are finished games in current round, get current round ranking
        if (finishedGames && finishedGames.length > 0) {
          const { data: roundRankings, error } = await supabase
            .rpc('get_round_rankings', {
              round_id: currentRound.id
            });

          if (!error && roundRankings?.length > 0) {
            const userRankIndex = roundRankings.findIndex(r => r.user_id === userId);
            if (userRankIndex !== -1) {
              return {
                rank: userRankIndex + 1,
                roundId: currentRound.id,
                roundName: currentRound.name,
                isCurrent: true
              };
            }
          }
        }
      }

      // If no current round or no finished games, get the previous round's rank
      const { data: previousRound, error: prevRoundError } = await supabase
        .from('rounds')
        .select('id, name')
        .lt('end_date', new Date().toISOString())
        .order('end_date', { ascending: false })
        .limit(1)
        .single();

      if (prevRoundError) {
        console.error('Error fetching previous round:', prevRoundError);
        return null;
      }

      const { data: prevRoundRankings, error: prevRankError } = await supabase
        .rpc('get_round_rankings', {
          round_id: previousRound.id
        });

      if (prevRankError) {
        console.error('Error fetching previous round rankings:', prevRankError);
        return null;
      }

      if (!prevRoundRankings || prevRoundRankings.length === 0) {
        return null;
      }

      const userRankIndex = prevRoundRankings.findIndex(r => r.user_id === userId);
      return userRankIndex !== -1 ? {
        rank: userRankIndex + 1,
        roundId: previousRound.id,
        roundName: previousRound.name,
        isCurrent: false
      } : null;
    },
    enabled: !!userId && !!session
  });
}