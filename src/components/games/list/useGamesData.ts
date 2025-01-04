import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subHours } from "date-fns";

export function useGamesData(userId?: string) {
  return useQuery({
    queryKey: ['games', userId],
    queryFn: async () => {
      console.log('Fetching games for user:', userId);
      
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
          predictions (
            id,
            user_id
          )
        `)
        .order('game_date', { ascending: true });

      if (error) {
        console.error('Error fetching games:', error);
        throw error;
      }

      const now = new Date();
      
      // Process and filter games
      return games
        .map(game => {
          const gameDate = new Date(game.game_date);
          const deadline = subHours(gameDate, 1);
          
          // Ensure game_results is always an array
          const gameResults = Array.isArray(game.game_results) 
            ? game.game_results 
            : game.game_results 
              ? [game.game_results] 
              : [];

          // Check if user has already predicted this game
          const userPrediction = userId 
            ? game.predictions?.some(p => p.user_id === userId)
            : false;

          // Game state checks
          const isBeforeDeadline = now < deadline;
          const hasNoFinalResult = !gameResults.some(r => r.is_final);

          return {
            ...game,
            game_results: gameResults,
            shouldShow: !userPrediction && isBeforeDeadline && hasNoFinalResult
          };
        })
        .filter(game => game.shouldShow);
    },
    refetchInterval: 30000, // Refetch every 30 seconds as backup
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}