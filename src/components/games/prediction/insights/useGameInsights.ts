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
  commonMargin: string;
  avgHomeWinMargin: number;
  avgAwayWinMargin: number;
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

      const insights = data[0];
      
      console.log('Processing insights:', insights);

      return {
        totalPredictions: insights.total_predictions,
        homeWinPredictions: insights.home_win_predictions,
        awayWinPredictions: insights.away_win_predictions,
        avgHomeScore: insights.avg_home_score,
        avgAwayScore: insights.avg_away_score,
        marginRange: insights.common_margin,
        totalPointsRange: insights.total_points_range,
        commonMargin: insights.common_margin,
        avgHomeWinMargin: insights.avg_home_win_margin || 0,
        avgAwayWinMargin: insights.avg_away_win_margin || 0,
      };
    },
    enabled: !!gameId,
  });
}