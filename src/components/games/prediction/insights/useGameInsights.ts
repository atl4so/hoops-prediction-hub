import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useGameInsights(gameId: string) {
  return useQuery({
    queryKey: ["game-insights", gameId],
    queryFn: async () => {
      // Fetch basic insights
      const { data: insightsData, error } = await supabase
        .rpc('get_game_prediction_insights', { game_id_param: gameId });

      if (error) throw error;

      // Get the first (and only) row from the insights array
      const insights = insightsData[0];

      if (!insights) {
        throw new Error("No insights found");
      }

      // Fetch top predictors with their predictions
      const { data: predictions } = await supabase
        .from('predictions')
        .select(`
          id,
          points_earned,
          prediction_home_score,
          prediction_away_score,
          profiles:user_id (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('game_id', gameId)
        .order('points_earned', { ascending: false })
        .limit(3);

      const topPredictors = predictions?.map(p => ({
        id: p.profiles.id,
        displayName: p.profiles.display_name,
        avatarUrl: p.profiles.avatar_url,
        points: p.points_earned || 0,
        prediction: {
          home: p.prediction_home_score,
          away: p.prediction_away_score
        }
      })) || [];

      return {
        totalPredictions: insights.total_predictions,
        homeWinPredictions: insights.home_win_predictions,
        awayWinPredictions: insights.away_win_predictions,
        avgHomeScore: insights.avg_home_score,
        avgAwayScore: insights.avg_away_score,
        commonMargin: insights.common_margin_range,
        marginRange: insights.common_margin_range,
        totalPointsRange: insights.common_total_points_range,
        avgHomeWinMargin: insights.avg_home_win_margin,
        avgAwayWinMargin: insights.avg_away_win_margin,
        topPredictors
      };
    },
    enabled: !!gameId
  });
}