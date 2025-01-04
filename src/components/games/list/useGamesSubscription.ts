import { useCallback, useEffect } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useGamesSubscription() {
  const queryClient = useQueryClient();

  const setupSubscriptions = useCallback(() => {
    console.log('Setting up real-time subscriptions for games...');
    
    const channel = supabase
      .channel('games-predictions-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games'
        },
        () => {
          console.log('Games table changed, invalidating queries...');
          queryClient.invalidateQueries({ queryKey: ['games'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions'
        },
        () => {
          console.log('Predictions table changed, invalidating queries...');
          queryClient.invalidateQueries({ queryKey: ['games'] });
          queryClient.invalidateQueries({ queryKey: ['predictions'] });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscriptions...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  useEffect(() => {
    return setupSubscriptions();
  }, [setupSubscriptions]);
}