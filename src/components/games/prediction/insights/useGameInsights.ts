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
}

export function useGameInsights(gameId: string) {
  return useQuery({
    queryKey: ['game-insights', gameId],
    queryFn: async () => {
      const { data: predictions, error } = await supabase
        .from('predictions')
        .select(`
          prediction_home_score,
          prediction_away_score
        `)
        .eq('game_id', gameId);

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

      // Calculate average margin for home wins
      const homeWinMargins = predictions
        .filter(p => p.prediction_home_score > p.prediction_away_score)
        .map(p => p.prediction_home_score - p.prediction_away_score);
      const avgHomeWinMargin = homeWinMargins.length > 0
        ? (homeWinMargins.reduce((a, b) => a + b, 0) / homeWinMargins.length).toFixed(1)
        : "0.0";

      // Calculate average margin for away wins
      const awayWinMargins = predictions
        .filter(p => p.prediction_home_score < p.prediction_away_score)
        .map(p => p.prediction_away_score - p.prediction_home_score);
      const avgAwayWinMargin = awayWinMargins.length > 0
        ? (awayWinMargins.reduce((a, b) => a + b, 0) / awayWinMargins.length).toFixed(1)
        : "0.0";

      // Calculate total points range
      const totalPoints = predictions.map(p => p.prediction_home_score + p.prediction_away_score);
      const minTotal = Math.min(...totalPoints);
      const maxTotal = Math.max(...totalPoints);
      const totalPointsRange = `${minTotal}-${maxTotal}`;

      return {
        totalPredictions,
        homeWinPredictions,
        awayWinPredictions,
        avgHomeScore,
        avgAwayScore,
        marginRange,
        totalPointsRange,
        commonMargin,
        homeWinMargin: `${avgHomeWinMargin} points`,
        awayWinMargin: `${avgAwayWinMargin} points`,
      };
    },
    enabled: !!gameId,
  });
}