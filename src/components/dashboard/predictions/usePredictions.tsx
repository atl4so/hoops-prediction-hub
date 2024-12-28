import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserPermissions } from "./useUserPermissions";

export function usePredictions(followedIds: string[], showFuturePredictions: boolean) {
  const { data: userPermission } = useUserPermissions();
  
  return useQuery({
    queryKey: ["followed-users-predictions", followedIds, showFuturePredictions, userPermission?.can_view_future_predictions],
    queryFn: async () => {
      if (!followedIds.length) return [];

      console.log('Fetching predictions with permission:', userPermission?.can_view_future_predictions);

      let query = supabase
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
        .order("created_at", { ascending: false });

      // If user doesn't have permission to view future predictions,
      // only show predictions where points have been earned
      if (!userPermission?.can_view_future_predictions) {
        console.log('Filtering for finished games only');
        query = query.not('points_earned', 'is', null);
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error("Error fetching predictions:", error);
        throw error;
      }

      console.log('Fetched predictions:', data);

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