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
          id: game.home_team.id,
          name: game.home_team.name,
          logo_url: game.home_team.logo_url
        },
        away_team: {
          id: game.away_team.id,
          name: game.away_team.name,
          logo_url: game.away_team.logo_url
        },
        round: {
          id: game.round.id,
          name: game.round.name
        },
        game_results: Array.isArray(game.game_results)
          ? game.game_results.map(result => ({
              home_score: result.home_score,
              away_score: result.away_score,
              is_final: result.is_final
            }))
          : game.game_results
            ? [{
                home_score: game.game_results.home_score,
                away_score: game.game_results.away_score,
                is_final: game.game_results.is_final
              }]
            : []
      }));

      // Split into finished and unfinished games
      const unfinishedGames = processedGames
        .filter(game => !game.game_results?.some(result => result.is_final))
        .sort((a, b) => new Date(a.game_date).getTime() - new Date(b.game_date).getTime());

      const finishedGames = processedGames
        .filter(game => game.game_results?.some(result => result.is_final))
        .sort((a, b) => new Date(b.game_date).getTime() - new Date(a.game_date).getTime());

      // Combine with unfinished games first
      return [...unfinishedGames, ...finishedGames];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}