import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useUserRoundPredictions(userId: string, selectedRound: string, isOpen: boolean) {
  return useQuery({
    queryKey: ["user-predictions", userId, selectedRound],
    queryFn: async () => {
      try {
        let query = supabase
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
          .eq("user_id", userId)
          .order('created_at', { ascending: false });

        if (selectedRound !== "all") {
          query = query.eq("game.round_id", selectedRound);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching predictions:", error);
          toast.error("Failed to load predictions");
          throw error;
        }

        if (!data?.length) {
          return [];
        }

        return data
          .filter(prediction => prediction.game)
          .map(prediction => ({
            ...prediction,
            game: {
              ...prediction.game,
              game_results: prediction.game.game_results || []
            }
          }));
      } catch (error) {
        console.error("Error in useUserRoundPredictions:", error);
        toast.error("Failed to load predictions");
        throw error;
      }
    },
    enabled: isOpen,
    staleTime: 1000 * 60, // Cache for 1 minute
    retry: 2,
  });
}