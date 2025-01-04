import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Prediction } from "@/types/supabase";

export function usePredictions(followedIds: string[]) {
  return useQuery({
    queryKey: ["followed-users-predictions", followedIds],
    queryFn: async () => {
      if (!followedIds.length) return [];

      console.log('Fetching predictions for users:', followedIds);

      const { data, error } = await supabase
        .from("predictions")
        .select(`
          id,
          prediction_home_score,
          prediction_away_score,
          points_earned,
          user:profiles!predictions_user_id_fkey (
            id,
            display_name,
            avatar_url
          ),
          game:games (
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
            )
          )
        `)
        .in("user_id", followedIds)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching predictions:", error);
        throw error;
      }

      console.log('Raw predictions data:', data);

      const mappedPredictions = data.map((item): Prediction => {
        const gameResults = Array.isArray(item.game.game_results) 
          ? item.game.game_results 
          : item.game.game_results 
            ? [item.game.game_results]
            : [];

        console.log(`Processing prediction for user ${item.user.display_name}:`, {
          id: item.id,
          userId: item.user.id,
          gameId: item.game.id,
          hasGameResults: gameResults.length > 0,
          gameDate: item.game.game_date,
          predictionScores: `${item.prediction_home_score}-${item.prediction_away_score}`,
          pointsEarned: item.points_earned
        });
        
        return {
          id: item.id,
          user: {
            id: item.user.id,
            display_name: item.user.display_name,
            avatar_url: item.user.avatar_url
          },
          game: {
            id: item.game.id,
            game_date: item.game.game_date,
            parsedDate: new Date(item.game.game_date),
            round: {
              id: item.game.round.id,
              name: item.game.round.name
            },
            home_team: {
              id: item.game.home_team.id,
              name: item.game.home_team.name,
              logo_url: item.game.home_team.logo_url
            },
            away_team: {
              id: item.game.away_team.id,
              name: item.game.away_team.name,
              logo_url: item.game.away_team.logo_url
            },
            game_results: gameResults
          },
          prediction_home_score: item.prediction_home_score,
          prediction_away_score: item.prediction_away_score,
          points_earned: item.points_earned
        };
      });

      console.log('Predictions summary:', mappedPredictions.map(p => ({
        userId: p.user.id,
        userName: p.user.display_name,
        gameDate: p.game.game_date,
        roundName: p.game.round.name,
        hasResults: p.game.game_results?.length > 0,
        points: p.points_earned
      })));

      return mappedPredictions;
    },
    enabled: followedIds.length > 0,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60 // Refetch every minute
  });
}