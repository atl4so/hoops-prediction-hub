import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Game } from "@/types/supabase";

export function useGamesData() {
  return useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      console.log('Fetching games data...');
      
      const { data, error } = await supabase
        .from("games")
        .select(`
          id,
          game_date,
          home_team:teams!games_home_team_id_fkey(
            id, 
            name, 
            logo_url
          ),
          away_team:teams!games_away_team_id_fkey(
            id, 
            name, 
            logo_url
          ),
          round:rounds(
            id,
            name
          ),
          game_results (
            home_score,
            away_score,
            is_final
          )
        `)
        .order('game_date', { ascending: true });

      if (error) {
        console.error("Error fetching games:", error);
        throw error;
      }

      console.log('Raw games data:', data);

      if (!data) {
        console.log("No games found");
        return [];
      }
      
      // Process games and parse dates
      const processedGames = data.map((game): Game => {
        console.log('Processing game:', game.id, {
          date: game.game_date,
          results: game.game_results
        });

        return {
          id: game.id,
          game_date: game.game_date,
          parsedDate: new Date(game.game_date),
          home_team: game.home_team[0],
          away_team: game.away_team[0],
          round: game.round[0],
          game_results: game.game_results || []
        };
      });

      console.log('Processed games:', processedGames.length, 'games');
      return processedGames;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}