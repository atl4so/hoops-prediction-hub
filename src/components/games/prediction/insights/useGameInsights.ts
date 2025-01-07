import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GameInsights {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  commonMarginRange: string;
  totalPointsRange: string;
  avgHomeWinMargin: number;
  avgAwayWinMargin: number;
}

export function useGameInsights(gameId: string) {
  return useQuery({
    queryKey: ["game-insights", gameId],
    queryFn: async () => {
      console.log('Fetching insights for game:', gameId);

      const { data: predictions, error } = await supabase
        .from("predictions")
        .select(`
          prediction_home_score,
          prediction_away_score
        `)
        .eq("game_id", gameId);

      if (error) {
        console.error('Error fetching predictions:', error);
        throw error;
      }

      if (!predictions?.length) {
        console.log('No predictions found for game:', gameId);
        return null;
      }

      console.log('Raw predictions data:', predictions);

      // Calculate insights
      const totalPredictions = predictions.length;
      const homeWinPredictions = predictions.filter(
        p => p.prediction_home_score > p.prediction_away_score
      ).length;
      const awayWinPredictions = predictions.filter(
        p => p.prediction_away_score > p.prediction_home_score
      ).length;

      const avgHomeScore = Number((predictions.reduce(
        (sum, p) => sum + p.prediction_home_score, 0
      ) / totalPredictions).toFixed(1));

      const avgAwayScore = Number((predictions.reduce(
        (sum, p) => sum + p.prediction_away_score, 0
      ) / totalPredictions).toFixed(1));

      // Calculate margins
      const margins = predictions.map(p => 
        Math.abs(p.prediction_home_score - p.prediction_away_score)
      );
      const avgMargin = margins.reduce((sum, m) => sum + m, 0) / margins.length;
      
      const commonMarginRange = 
        avgMargin <= 5 ? 'Close (1-5)' :
        avgMargin <= 10 ? 'Moderate (6-10)' :
        'Wide (10+)';

      // Calculate total points range
      const totalPoints = predictions.map(p => 
        p.prediction_home_score + p.prediction_away_score
      );
      const minTotal = Math.min(...totalPoints);
      const maxTotal = Math.max(...totalPoints);
      const totalPointsRange = `${minTotal}-${maxTotal}`;

      // Calculate average margins for home/away wins
      const homeWinMargins = predictions
        .filter(p => p.prediction_home_score > p.prediction_away_score)
        .map(p => p.prediction_home_score - p.prediction_away_score);
      
      const awayWinMargins = predictions
        .filter(p => p.prediction_away_score > p.prediction_home_score)
        .map(p => p.prediction_away_score - p.prediction_home_score);

      const avgHomeWinMargin = homeWinMargins.length
        ? Number((homeWinMargins.reduce((sum, m) => sum + m, 0) / homeWinMargins.length).toFixed(1))
        : 0;

      const avgAwayWinMargin = awayWinMargins.length
        ? Number((awayWinMargins.reduce((sum, m) => sum + m, 0) / awayWinMargins.length).toFixed(1))
        : 0;

      console.log('Calculated insights:', {
        totalPredictions,
        homeWinPredictions,
        awayWinPredictions,
        avgHomeScore,
        avgAwayScore,
        commonMarginRange,
        totalPointsRange,
        avgHomeWinMargin,
        avgAwayWinMargin
      });

      return {
        totalPredictions,
        homeWinPredictions,
        awayWinPredictions,
        avgHomeScore,
        avgAwayScore,
        commonMarginRange,
        totalPointsRange,
        avgHomeWinMargin,
        avgAwayWinMargin
      };
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
    retry: 3
  });
}