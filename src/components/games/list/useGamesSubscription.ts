import { useCallback, useEffect } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useGamesSubscription() {
  const queryClient = useQueryClient();

  const setupSubscriptions = useCallback(() => {
    console.log('Setting up real-time subscriptions for games and results...');
    
    const channel = supabase
      .channel('games-and-results-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_results'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['games'] });
          queryClient.invalidateQueries({ queryKey: ['predictions'] });
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
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
          queryClient.invalidateQueries({ queryKey: ['predictions'] });
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscriptions...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  useEffect(() => {
    return setupSubscriptions();
  }, [setupSubscriptions]);
}