import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Prediction } from "@/types/supabase";

export function usePredictions(followedIds: string[]) {
  return useQuery({
    queryKey: ["followed-users-predictions", followedIds],
    queryFn: async () => {
      if (!followedIds.length) return [];

      const { data, error } = await supabase
        .from("predictions")
        .select(`
          id,
          prediction_home_score,
          prediction_away_score,
          points_earned,
          user:profiles!predictions_user_id_fkey (
            id,
            display_name,
            avatar_url
          ),
          game:games (
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey (
              id,
              name,
              logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
              id,
              name,
              logo_url
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

      return data.map((item): Prediction => ({
        id: item.id,
        user: item.user,
        game: {
          ...item.game,
          game_results: Array.isArray(item.game.game_results) 
            ? item.game.game_results 
            : item.game.game_results 
              ? [item.game.game_results]
              : []
        },
        prediction_home_score: item.prediction_home_score,
        prediction_away_score: item.prediction_away_score,
        points_earned: item.points_earned
      }));
    },
    enabled: followedIds.length > 0
  });
}