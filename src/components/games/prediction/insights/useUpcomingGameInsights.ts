import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GamePrediction {
  prediction_home_score: number;
  prediction_away_score: number;
}

interface GameInsights {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  commonMarginRange: string;
  commonTotalPointsRange: string;
}

export function useUpcomingGameInsights(gameId: string) {
  return useQuery({
    queryKey: ["upcoming-game-insights", gameId],
    queryFn: async () => {
      console.log('Fetching upcoming game insights for game:', gameId);

      // First, check if the game has any results
      const { data: gameResults } = await supabase
        .from("game_results")
        .select("id")
        .eq("game_id", gameId)
        .maybeSingle();

      // If game has results, don't fetch predictions
      if (gameResults) {
        console.log('Game already has results, skipping insights');
        return null;
      }

      // Fetch predictions for this game
      const { data: predictions, error } = await supabase
        .from("predictions")
        .select("prediction_home_score, prediction_away_score")
        .eq("game_id", gameId);

      if (error) {
        console.error('Error fetching upcoming game insights:', error);
        throw error;
      }

      if (!predictions?.length) {
        console.log('No predictions found for game:', gameId);
        return null;
      }

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

      // Calculate most common margin range
      const margins = predictions.map(p => 
        Math.abs(p.prediction_home_score - p.prediction_away_score)
      );
      const avgMargin = margins.reduce((sum, m) => sum + m, 0) / margins.length;
      
      const commonMarginRange = 
        avgMargin <= 5 ? 'Close (1-5)' :
        avgMargin <= 10 ? 'Moderate (6-10)' :
        'Wide (10+)';

      // Calculate most common total points range
      const totalPoints = predictions.map(p => 
        p.prediction_home_score + p.prediction_away_score
      );
      const avgTotal = totalPoints.reduce((sum, t) => sum + t, 0) / totalPoints.length;
      
      const commonTotalPointsRange = 
        avgTotal < 150 ? 'Under 150' :
        avgTotal < 165 ? '150-165' :
        'Over 165';

      return {
        totalPredictions,
        homeWinPredictions,
        awayWinPredictions,
        avgHomeScore,
        avgAwayScore,
        commonMarginRange,
        commonTotalPointsRange
      };
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60 // Refetch every minute
  });
}