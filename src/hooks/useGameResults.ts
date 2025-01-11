import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useGameResults() {
  return useQuery({
    queryKey: ['game-results'],
    queryFn: async () => {
      console.log('Fetching games without final results...');
      const { data, error } = await supabase
        .from('games')
        .select(`
          id,
          game_date,
          round (
            id,
            name
          ),
          home_team:teams!games_home_team_id_fkey (
            name
          ),
          away_team:teams!games_away_team_id_fkey (
            name
          ),
          game_results (
            id,
            home_score,
            away_score,
            is_final
          )
        `)
        .is('game_results', null)
        .order('game_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching games without results:', error);
        throw error;
      }

      console.log('Fetched games without results:', data);
      return data;
    },
  });
}