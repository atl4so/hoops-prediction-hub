import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Prediction } from "@/types/prediction";

export const usePredictions = (userId: string, selectedRound: string) => {
  return useQuery<Prediction[]>({
    queryKey: ['predictions', userId, selectedRound],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          id,
          prediction_home_score,
          prediction_away_score,
          game:games!inner (
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey (
              name
            ),
            away_team:teams!games_away_team_id_fkey (
              name
            ),
            game_results!inner (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .eq('user_id', userId)
        .eq('game.round_id', selectedRound);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!userId && !!selectedRound,
  });
};
