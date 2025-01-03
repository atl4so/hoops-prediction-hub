import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Game } from "@/types/supabase";

export function useGamesData() {
  return useQuery({
    queryKey: ["games"],
    queryFn: async () => {
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
        `);

      if (error) {
        console.error("Error fetching games:", error);
        throw error;
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
        game_results: game.game_results ? game.game_results.map(result => ({
          home_score: result.home_score,
          away_score: result.away_score,
          is_final: result.is_final
        })) : []
      }));

      // Split into finished and unfinished games
      const unfinishedGames = processedGames
        .filter(game => !game.game_results?.some(result => result.is_final))
        .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

      const finishedGames = processedGames
        .filter(game => game.game_results?.some(result => result.is_final))
        .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());

      // Combine with unfinished games first
      return [...unfinishedGames, ...finishedGames];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}