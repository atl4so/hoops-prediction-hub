import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export function useGameResults() {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up game results subscription...');
    
    const channel = supabase
      .channel('game-results-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_results'
        },
        (payload) => {
          console.log('Game result changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['game-results'] });
          queryClient.invalidateQueries({ queryKey: ['predictions'] });
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
        }
      )
      .subscribe((status) => {
        console.log('Game results subscription status:', status);
      });

    return () => {
      console.log('Cleaning up game results subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['game-results'],
    queryFn: async () => {
      console.log('Fetching game results...');
      const { data, error } = await supabase
        .from('game_results')
        .select(`
          id,
          home_score,
          away_score,
          is_final,
          created_at,
          updated_at,
          game:games(
            id,
            game_date,
            round:rounds(id, name),
            home_team:teams!games_home_team_id_fkey(name),
            away_team:teams!games_away_team_id_fkey(name)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching game results:', error);
        throw error;
      }
      console.log('Fetched game results:', data);
      return data || [];
    },
  });
}