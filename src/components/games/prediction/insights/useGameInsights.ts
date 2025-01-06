import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GameInsights {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  marginRange: string;
  totalPointsRange: string;
  gameResult?: {
    home_score: number;
    away_score: number;
    is_final: boolean;
  };
}

export function useGameInsights(gameId: string) {
  return useQuery({
    queryKey: ['gameInsights', gameId],
    queryFn: async (): Promise<GameInsights | null> => {
      const { data, error } = await supabase
        .rpc('get_game_prediction_insights', {
          game_id_param: gameId
        });

      if (error) {
        console.error('Error fetching game insights:', error);
        throw error;
      }

      if (!data?.[0]) return null;

      const result = data[0];
      
      return {
        totalPredictions: Number(result.total_predictions),
        homeWinPredictions: Number(result.home_win_predictions),
        awayWinPredictions: Number(result.away_win_predictions),
        avgHomeScore: Number(result.avg_home_score),
        avgAwayScore: Number(result.avg_away_score),
        marginRange: result.common_margin_range,
        totalPointsRange: result.common_total_points_range,
        gameResult: result.game_result ? {
          home_score: result.game_result.home_score,
          away_score: result.game_result.away_score,
          is_final: result.game_result.is_final
        } : undefined
      };
    }
  });
}