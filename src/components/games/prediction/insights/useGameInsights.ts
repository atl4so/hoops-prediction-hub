import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useGameInsights(gameId: string) {
  return useQuery({
    queryKey: ['game-insights', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_game_prediction_insights', {
          game_id_param: gameId
        });

      if (error) throw error;
      if (!data?.[0]) return null;

      return {
        totalPredictions: data[0].total_predictions,
        homeWinPredictions: data[0].home_win_predictions,
        awayWinPredictions: data[0].away_win_predictions,
        avgHomeScore: data[0].avg_home_score,
        avgAwayScore: data[0].avg_away_score,
        marginRange: data[0].common_margin_range,
        totalPointsRange: data[0].common_total_points_range,
        commonMargin: `${data[0].common_margin_range} points`,
        avgHomeWinMargin: data[0].avg_home_win_margin,
        avgAwayWinMargin: data[0].avg_away_win_margin,
      };
    },
    enabled: !!gameId,
  });
}