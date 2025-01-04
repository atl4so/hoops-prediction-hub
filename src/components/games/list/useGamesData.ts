import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subHours } from "date-fns";

export function useGamesData(userId?: string) {
  return useQuery({
    queryKey: ['games', userId],
    queryFn: async () => {
      const { data: games, error } = await supabase
        .from('games')
        .select(`
          id,
          game_date,
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
          round:rounds (
            id,
            name
          ),
          game_results (
            home_score,
            away_score,
            is_final
          ),
          predictions!inner (
            id,
            user_id
          )
        `)
        .order('game_date', { ascending: true });

      if (error) {
        console.error('Error fetching games:', error);
        throw error;
      }

      // Filter and process games
      return games.map(game => {
        const gameDate = new Date(game.game_date);
        const deadline = subHours(gameDate, 1);
        const now = new Date();

        // Check if user has already predicted this game
        const userPrediction = userId ? game.predictions.find(p => p.user_id === userId) : null;
        const notPredictedByUser = !userPrediction;

        // Game state checks
        const isBeforeDeadline = now < deadline;
        const hasNoFinalResult = !game.game_results?.some(r => r.is_final);

        return {
          ...game,
          parsedDate: gameDate,
          deadline,
          notPredictedByUser,
          isBeforeDeadline,
          hasNoFinalResult,
          userPredictions: game.predictions.map(p => p.user_id)
        };
      }).filter(game => {
        // Only show games that:
        // 1. Haven't been predicted by the user yet AND
        // 2. Are before the deadline AND
        // 3. Don't have a final result
        return game.notPredictedByUser && game.isBeforeDeadline && game.hasNoFinalResult;
      });
    },
    enabled: !!userId
  });
}