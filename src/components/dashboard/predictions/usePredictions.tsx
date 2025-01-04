import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Prediction } from "@/types/supabase";

export function usePredictions(followedIds: string[]) {
  return useQuery({
    queryKey: ["followed-users-predictions", followedIds],
    queryFn: async () => {
      if (!followedIds.length) return [];

      console.log('Fetching predictions for users:', followedIds);

      // First, let's verify the user exists and has predictions
      const { data: userPredictions, error: countError } = await supabase
        .from("predictions")
        .select("id, user_id")
        .in("user_id", followedIds);

      if (countError) {
        console.error("Error checking predictions:", countError);
        throw countError;
      }

      console.log('Found predictions count by user:', 
        userPredictions.reduce((acc, pred) => {
          acc[pred.user_id] = (acc[pred.user_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      );

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
        .in("user_id", followedIds);
      
      if (error) {
        console.error("Error fetching predictions:", error);
        throw error;
      }

      console.log('Raw predictions data:', JSON.stringify(data, null, 2));

      const mappedPredictions = data.map((item): Prediction => {
        console.log(`Processing prediction for user ${item.user.display_name}:`, {
          id: item.id,
          userId: item.user.id,
          gameId: item.game.id,
          roundId: item.game.round.id,
          hasGameResults: item.game.game_results?.length > 0
        });
        
        const prediction = {
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
            game_results: Array.isArray(item.game.game_results) 
              ? item.game.game_results 
              : item.game.game_results 
                ? [item.game.game_results]
                : []
          },
          prediction_home_score: item.prediction_home_score,
          prediction_away_score: item.prediction_away_score,
          points_earned: item.points_earned
        };

        return prediction;
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
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60 // Refetch every minute
  });
}