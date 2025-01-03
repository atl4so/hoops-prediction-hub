import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { UserPrediction } from "@/types/supabase";

export function useUserRoundPredictions(userId: string, selectedRound: string, isOpen: boolean) {
  return useQuery({
    queryKey: ["user-predictions", userId, selectedRound],
    queryFn: async () => {
      try {
        if (!selectedRound) {
          return [];
        }

        const { data, error } = await supabase
          .from("predictions")
          .select(`
            id,
            prediction_home_score,
            prediction_away_score,
            points_earned,
            game:games (
              id,
              game_date,
              round_id,
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
          .eq("user_id", userId)
          .eq("game.round_id", selectedRound);

        if (error) {
          console.error("Error fetching predictions:", error);
          throw error;
        }

        return data.map((item): UserPrediction => ({
          id: item.id,
          prediction: {
            prediction_home_score: item.prediction_home_score,
            prediction_away_score: item.prediction_away_score,
            points_earned: item.points_earned
          },
          game: {
            id: item.game.id,
            game_date: item.game.game_date,
            parsedDate: new Date(item.game.game_date),
            round: {
              id: selectedRound,
              name: item.game.round_id.toString()
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
              ? item.game.game_results.map(result => ({
                  home_score: result.home_score,
                  away_score: result.away_score,
                  is_final: result.is_final
                }))
              : item.game.game_results
                ? [{
                    home_score: item.game.game_results.home_score,
                    away_score: item.game.game_results.away_score,
                    is_final: item.game.game_results.is_final
                  }]
                : []
          }
        }));
      } catch (error) {
        console.error("Error in useUserRoundPredictions:", error);
        throw error;
      }
    },
    enabled: isOpen && !!selectedRound && !!userId,
    staleTime: 1000 * 60,
    retry: 2,
  });
}