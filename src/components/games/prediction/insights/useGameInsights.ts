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

      // Calculate margins and total points for each prediction
      const margins = predictions.map(p => Math.abs(p.prediction_home_score - p.prediction_away_score));
      const totalPoints = predictions.map(p => p.prediction_home_score + p.prediction_away_score);

      // Find min and max values
      const minMargin = Math.min(...margins);
      const maxMargin = Math.max(...margins);
      const minTotal = Math.min(...totalPoints);
      const maxTotal = Math.max(...totalPoints);

      // Determine ranges
      const marginRange = `${minMargin}-${maxMargin} points`;
      const totalPointsRange = `${minTotal}-${maxTotal}`;

      return {
        totalPredictions,
        homeWinPredictions,
        awayWinPredictions,
        avgHomeScore,
        avgAwayScore,
        marginRange,
        totalPointsRange,
      };
    },
    enabled: !!gameId,
  });
}