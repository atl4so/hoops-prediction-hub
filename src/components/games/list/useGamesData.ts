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
          home_team:teams!games_home_team_id_fkey(id, name, logo_url),
          away_team:teams!games_away_team_id_fkey(id, name, logo_url),
          round:rounds(id, name),
          game_results(
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

      if (!data) {
        console.log("No games found");
        return [];
      }
      
      // Process games and parse dates
      const processedGames = data.map((game): Game => ({
        id: game.id,
        game_date: game.game_date,
        parsedDate: new Date(game.game_date),
        home_team: {
          id: game.home_team[0].id,
          name: game.home_team[0].name,
          logo_url: game.home_team[0].logo_url
        },
        away_team: {
          id: game.away_team[0].id,
          name: game.away_team[0].name,
          logo_url: game.away_team[0].logo_url
        },
        round: {
          id: game.round[0].id,
          name: game.round[0].name
        },
        // Ensure game_results is always an array
        game_results: Array.isArray(game.game_results) ? game.game_results : (game.game_results ? [game.game_results] : [])
      }));

      console.log('Processed games:', processedGames);
      return processedGames;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}