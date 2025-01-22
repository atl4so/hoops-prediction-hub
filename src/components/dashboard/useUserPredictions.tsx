import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

export function useUserPredictions(userId: string | null) {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();

  return useQuery({
    queryKey: ['userPredictions', userId],
    queryFn: async () => {
      console.log('Fetching predictions for user:', userId);
      if (!userId) return null;

      try {
        const { data, error } = await supabase
          .from('predictions')
          .select(`
            id,
            prediction_home_score,
            prediction_away_score,
            points_earned,
            game:games (
              id,
              game_date,
              game_code,
              round_id,
              round:rounds (
                id,
                name
              ),
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
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching predictions:', error);
          throw error;
        }

        console.log('Raw predictions data:', data);

        return data.map(prediction => ({
          ...prediction,
          game: {
            ...prediction.game,
            game_results: Array.isArray(prediction.game.game_results) 
              ? prediction.game.game_results 
              : prediction.game.game_results 
                ? [prediction.game.game_results]
                : []
          }
        }));
      } catch (error) {
        console.error('Error in predictions query:', error);
        toast.error("Failed to load predictions");
        throw error;
      }
    },
    enabled: !!userId && !!session,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2
  });
}