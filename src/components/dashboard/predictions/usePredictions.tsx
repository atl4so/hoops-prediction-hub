import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePredictions(followedIds: string[]) {
  return useQuery({
    queryKey: ["followed-users-predictions", followedIds],
    queryFn: async () => {
      if (!followedIds.length) return [];

      const { data, error } = await supabase
        .from("predictions")
        .select(`
          prediction_home_score,
          prediction_away_score,
          points_earned,
          user:profiles!predictions_user_id_fkey (
            id,
            display_name
          ),
          game:games (
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey (
              name
            ),
            away_team:teams!games_away_team_id_fkey (
              name
            ),
            game_results (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .in("user_id", followedIds)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching predictions:", error);
        throw error;
      }

      return data.map(prediction => ({
        ...prediction,
        game: {
          ...prediction.game,
          game_results: Array.isArray(prediction.game.game_results) 
            ? prediction.game.game_results 
            : [prediction.game.game_results].filter(Boolean)
        }
      }));
    },
    enabled: followedIds.length > 0
  });
}