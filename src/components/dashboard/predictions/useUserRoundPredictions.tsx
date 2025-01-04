import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PredictionData {
  id: string;
  game: {
    id: string;
    game_date: string;
    round_id: string;
    home_team: {
      name: string;
      logo_url: string;
    };
    away_team: {
      name: string;
      logo_url: string;
    };
    game_results?: Array<{
      home_score: number;
      away_score: number;
      is_final?: boolean;
    }>;
  };
  prediction: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  };
}

export function useUserRoundPredictions(userId: string, roundId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["user-round-predictions", userId, roundId],
    queryFn: async () => {
      console.log('Fetching predictions for user:', userId, 'round:', roundId);

      // First get the games for the round to ensure proper ordering
      const { data: games } = await supabase
        .from('games')
        .select('id')
        .eq('round_id', roundId)
        .order('game_date', { ascending: true });

      if (!games) return [];

      // Then get predictions for these games
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          id,
          prediction_home_score,
          prediction_away_score,
          points_earned,
          game:games!inner (
            id,
            game_date,
            round_id,
            home_team:teams!games_home_team_id_fkey (
              name,
              logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
              name,
              logo_url
            ),
            game_results (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .eq('user_id', userId)
        .eq('game.round_id', roundId)
        .in('game_id', games.map(g => g.id));

      if (error) {
        console.error('Error fetching predictions:', error);
        throw error;
      }

      console.log('Raw predictions data:', data);

      // Transform the data to match the expected format
      const transformedData = (data || []).map(item => ({
        id: item.id,
        game: {
          ...item.game,
          game_results: Array.isArray(item.game.game_results) 
            ? item.game.game_results 
            : item.game.game_results 
              ? [item.game.game_results]
              : []
        },
        prediction: {
          prediction_home_score: item.prediction_home_score,
          prediction_away_score: item.prediction_away_score,
          points_earned: item.points_earned
        }
      }));

      // Sort by game date after transformation
      return transformedData.sort((a, b) => 
        new Date(a.game.game_date).getTime() - new Date(b.game.game_date).getTime()
      );
    },
    enabled: enabled && !!userId && !!roundId,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5 // 5 minutes
  });
}