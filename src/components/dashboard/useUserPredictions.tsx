import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { useEffect } from "react";
import { toast } from "sonner";

export function useUserPredictions(userId: string | null) {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    let retryCount = 0;
    let retryTimeout: NodeJS.Timeout;
    const maxRetries = 3;

    const setupChannel = () => {
      console.log('Setting up predictions channel...');
      const channel = supabase
        .channel('predictions-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'predictions'
          },
          (payload) => {
            console.log('Predictions changed:', payload);
            queryClient.invalidateQueries({ queryKey: ['userPredictions', userId] });
          }
        )
        .subscribe(async (status) => {
          console.log('Predictions subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to predictions changes');
            retryCount = 0;
            if (retryTimeout) clearTimeout(retryTimeout);
          } else if (status === 'CLOSED' && retryCount < maxRetries) {
            console.log('Subscription closed, attempting to reconnect...');
            retryCount++;
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            if (retryTimeout) clearTimeout(retryTimeout);
            retryTimeout = setTimeout(() => {
              console.log(`Retrying connection (attempt ${retryCount})...`);
              supabase.removeChannel(channel).then(() => setupChannel());
            }, delay);
          } else if (retryCount >= maxRetries) {
            console.error('Failed to establish reliable connection after multiple attempts');
            // Connection error toast removed as requested
          }
        });

      return channel;
    };

    const channel = setupChannel();

    return () => {
      console.log('Cleaning up predictions channel...');
      if (retryTimeout) clearTimeout(retryTimeout);
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient, supabase]);

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
      } catch (error) {
        console.error('Error in predictions query:', error);
        toast.error("Failed to load predictions", {
          id: 'predictions-error' // Prevent duplicate toasts
        });
        throw error;
      }
    },
    enabled: !!userId && !!session,
    staleTime: 1000 * 60, // Cache for 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3
  });
}