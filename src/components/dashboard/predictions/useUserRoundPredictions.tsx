import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PredictionData {
  id: string;
  prediction_home_score: number;
  prediction_away_score: number;
  points_earned?: number;
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
}

export function useUserRoundPredictions(userId: string, roundId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["user-round-predictions", userId, roundId],
    queryFn: async () => {
      console.log('Fetching predictions for user:', userId, 'round:', roundId);

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
        .order('game.game_date', { ascending: true });

      if (error) {
        console.error('Error fetching predictions:', error);
        throw error;
      }

      console.log('Raw predictions data:', data);

      // Transform the data to match the expected format
      const transformedData = (data as PredictionData[]).map(item => ({
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

      console.log('Transformed predictions:', transformedData);

      return transformedData;
    },
    enabled: enabled && !!userId && !!roundId,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5 // 5 minutes
  });
}