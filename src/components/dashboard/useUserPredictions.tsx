import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { useEffect } from "react";

export function useUserPredictions(userId: string | null) {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('predictions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions'
        },
        () => {
          console.log('Predictions changed, invalidating queries...');
          queryClient.invalidateQueries({ queryKey: ['userPredictions', userId] });
        }
      )
      .subscribe((status) => {
        console.log('Predictions subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient, supabase]);

  return useQuery({
    queryKey: ['userPredictions', userId],
    queryFn: async () => {
      console.log('Fetching predictions for user:', userId);
      if (!userId) return null;

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
      
      const transformedData = data.map(prediction => ({
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

      console.log('Transformed predictions data:', transformedData);
      return transformedData;
    },
    enabled: !!userId && !!session,
    staleTime: 1000 * 60, // Cache for 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
}