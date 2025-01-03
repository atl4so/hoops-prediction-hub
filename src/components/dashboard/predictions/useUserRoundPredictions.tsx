import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
          toast.error("Failed to load predictions");
          throw error;
        }

        // Filter out predictions without games and transform the data
        const predictions = data
          ?.filter(prediction => prediction.game)  
          .map(prediction => ({
            id: prediction.id,
            game: {
              ...prediction.game,
              game_results: Array.isArray(prediction.game.game_results)
                ? prediction.game.game_results
                : prediction.game.game_results
                  ? [prediction.game.game_results]
                  : []
            },
            prediction: {
              prediction_home_score: prediction.prediction_home_score,
              prediction_away_score: prediction.prediction_away_score,
              points_earned: prediction.points_earned
            }
          })) || [];

        // Sort predictions by game date and finished status
        return predictions.sort((a, b) => {
          const aFinished = a.game.game_results?.some(result => result.is_final) ?? false;
          const bFinished = b.game.game_results?.some(result => result.is_final) ?? false;
          
          // If one is finished and the other isn't, put unfinished first
          if (aFinished !== bFinished) {
            return aFinished ? 1 : -1;
          }
          
          // Otherwise sort by game date
          return new Date(a.game.game_date).getTime() - new Date(b.game.game_date).getTime();
        });
      } catch (error) {
        console.error("Error in useUserRoundPredictions:", error);
        toast.error("Failed to load predictions");
        throw error;
      }
    },
    enabled: isOpen && !!selectedRound && !!userId,
    staleTime: 1000 * 60,
    retry: 2,
  });
}