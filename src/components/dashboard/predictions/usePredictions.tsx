import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Prediction } from "@/types/supabase";

export function usePredictions(followedIds: string[]) {
  return useQuery({
    queryKey: ["followed-users-predictions", followedIds],
    queryFn: async () => {
      if (!followedIds.length) return [];

      console.log('Fetching predictions for users:', followedIds);

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
            round:rounds (
              id,
              name
            ),
            game_results (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .in("user_id", followedIds);
      
      if (error) {
        console.error("Error fetching predictions:", error);
        throw error;
      }

      console.log('Raw predictions data:', data);

      const mappedPredictions = data.map((item): Prediction => {
        const prediction = {
          id: item.id,
          user: {
            id: item.user.id,
            display_name: item.user.display_name,
            avatar_url: item.user.avatar_url
          },
          game: {
            id: item.game.id,
            game_date: item.game.game_date,
            parsedDate: new Date(item.game.game_date),
            round: {
              id: item.game.round.id,
              name: item.game.round.name
            },
            home_team: {
              id: item.game.home_team.id,
              name: item.game.home_team.name,
              logo_url: item.game.home_team.logo_url
            },
            away_team: {
              id: item.game.away_team.id,
              name: item.game.away_team.name,
              logo_url: item.game.away_team.logo_url
            },
            game_results: Array.isArray(item.game.game_results) 
              ? item.game.game_results 
              : item.game.game_results 
                ? [item.game.game_results]
                : []
          },
          prediction_home_score: item.prediction_home_score,
          prediction_away_score: item.prediction_away_score,
          points_earned: item.points_earned
        };

        console.log(`Prediction for user ${item.user.display_name}:`, {
          gameDate: prediction.game.game_date,
          gameResults: prediction.game.game_results,
          points: prediction.points_earned
        });

        return prediction;
      });

      console.log('Total mapped predictions:', mappedPredictions.length);
      return mappedPredictions;
    },
    enabled: followedIds.length > 0,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60 // Refetch every minute
  });
}