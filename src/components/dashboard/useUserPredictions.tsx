import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useUserPredictions(userId: string | null) {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!userId) return;

    const setupChannel = () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      console.log('Setting up predictions channel...');
      const channel = supabase
        .channel(`predictions-${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'predictions',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('Predictions changed:', payload);
            queryClient.invalidateQueries({ queryKey: ['userPredictions', userId] });
            // Also invalidate the user profile to refresh stats
            queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
          }
        )
        .subscribe((status) => {
          console.log('Predictions subscription status:', status);
        });

      channelRef.current = channel;
      return channel;
    };

    const channel = setupChannel();

    return () => {
      console.log('Cleaning up predictions channel...');
      if (channel) {
        supabase.removeChannel(channel);
      }
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