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
  homeWinMargin: string;
  awayWinMargin: string;
  topPredictors: Array<{
    points_earned: number;
    prediction_home_score: number;
    prediction_away_score: number;
    profiles: {
      display_name: string;
      avatar_url: string | null;
    };
  }>;
}

export function useGameInsights(gameId: string) {
  return useQuery({
    queryKey: ['game-insights', gameId],
    queryFn: async () => {
      const { data: predictions, error } = await supabase
        .from('predictions')
        .select(`
          prediction_home_score,
          prediction_away_score,
          points_earned,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq('game_id', gameId)
        .order('points_earned', { ascending: false });

      if (error) throw error;
      if (!predictions?.length) return null;

      const totalPredictions = predictions.length;
      const homeWinPredictions = predictions.filter(p => p.prediction_home_score > p.prediction_away_score).length;
      const awayWinPredictions = predictions.filter(p => p.prediction_home_score < p.prediction_away_score).length;

      // Calculate average scores
      const avgHomeScore = predictions.reduce((acc, p) => acc + p.prediction_home_score, 0) / totalPredictions;
      const avgAwayScore = predictions.reduce((acc, p) => acc + p.prediction_away_score, 0) / totalPredictions;

      // Calculate the common margin from average scores
      const marginRange = Math.abs(avgHomeScore - avgAwayScore).toFixed(1);
      const commonMargin = `${marginRange} points`;

      // Calculate average predicted margin for home win predictions
      const homeWinPredictedMargins = predictions
        .filter(p => p.prediction_home_score > p.prediction_away_score)
        .map(p => p.prediction_home_score - p.prediction_away_score);
      
      const avgHomeWinPredictedMargin = homeWinPredictedMargins.length > 0
        ? (homeWinPredictedMargins.reduce((a, b) => a + b, 0) / homeWinPredictedMargins.length).toFixed(1)
        : "0.0";

      // Calculate average predicted margin for away win predictions
      const awayWinPredictedMargins = predictions
        .filter(p => p.prediction_home_score < p.prediction_away_score)
        .map(p => p.prediction_away_score - p.prediction_home_score);
      
      const avgAwayWinPredictedMargin = awayWinPredictedMargins.length > 0
        ? (awayWinPredictedMargins.reduce((a, b) => a + b, 0) / awayWinPredictedMargins.length).toFixed(1)
        : "0.0";

      // Calculate total points range
      const totalPoints = predictions.map(p => p.prediction_home_score + p.prediction_away_score);
      const minTotal = Math.min(...totalPoints);
      const maxTotal = Math.max(...totalPoints);
      const totalPointsRange = `${minTotal}-${maxTotal}`;

      // Get top 3 predictors
      const topPredictors = predictions
        .filter(p => p.points_earned !== null)
        .sort((a, b) => (b.points_earned || 0) - (a.points_earned || 0))
        .slice(0, 3);

      return {
        totalPredictions,
        homeWinPredictions,
        awayWinPredictions,
        avgHomeScore,
        avgAwayScore,
        marginRange,
        totalPointsRange,
        commonMargin,
        homeWinMargin: `${avgHomeWinPredictedMargin} points`,
        awayWinMargin: `${avgAwayWinPredictedMargin} points`,
        topPredictors,
      };
    },
    enabled: !!gameId,
  });
}