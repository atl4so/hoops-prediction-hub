import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define Json type locally since it's not exported from supabase types
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

interface GameInsights {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  marginRange: string;
  totalPointsRange: string;
  commonMargin: string;
  avgHomeWinMargin: number;
  avgAwayWinMargin: number;
}

interface RawGameInsights {
  total_predictions: number;
  home_win_predictions: number;
  away_win_predictions: number;
  avg_home_score: number;
  avg_away_score: number;
  common_margin_range: string;
  common_total_points_range: string;
  last_game_result: Json;
  game_result: Json;
  avg_home_win_margin: number;
  avg_away_win_margin: number;
}

export function useGameInsights(gameId: string) {
  return useQuery({
    queryKey: ['game-insights', gameId],
    queryFn: async () => {
      console.log('Fetching insights for game:', gameId);
      
      const { data, error } = await supabase
        .rpc('get_game_prediction_insights', {
          game_id_param: gameId
        });

      if (error) {
        console.error('Error fetching game insights:', error);
        throw error;
      }

      console.log('Raw insights data:', data);

      if (!data?.length) {
        console.log('No insights found for game:', gameId);
        return null;
      }

      const insights = data[0] as RawGameInsights;
      
      console.log('Processing insights:', insights);

      return {
        totalPredictions: insights.total_predictions,
        homeWinPredictions: insights.home_win_predictions,
        awayWinPredictions: insights.away_win_predictions,
        avgHomeScore: insights.avg_home_score,
        avgAwayScore: insights.avg_away_score,
        marginRange: insights.common_margin_range,
        totalPointsRange: insights.common_total_points_range,
        commonMargin: insights.common_margin_range,
        avgHomeWinMargin: insights.avg_home_win_margin || 0,
        avgAwayWinMargin: insights.avg_away_win_margin || 0,
      } as GameInsights;
    },
    enabled: !!gameId,
  });
}