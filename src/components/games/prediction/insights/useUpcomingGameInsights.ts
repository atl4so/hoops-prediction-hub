import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UpcomingGameInsights {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  marginRange: string;
  totalPointsRange: string;
}

export function useUpcomingGameInsights(gameId: string) {
  return useQuery({
    queryKey: ['upcoming-game-insights', gameId],
    queryFn: async () => {
      console.log('Fetching upcoming game insights for game:', gameId);
      
      const { data: predictions, error } = await supabase
        .from('predictions')
        .select(`
          prediction_home_score,
          prediction_away_score
        `)
        .eq('game_id', gameId)
        // Only get predictions for games that haven't started
        .not('game_id', 'in', (
          supabase
            .from('game_results')
            .select('game_id')
        ));

      if (error) {
        console.error('Error fetching upcoming game insights:', error);
        throw error;
      }

      if (!predictions?.length) {
        console.log('No predictions found for upcoming game:', gameId);
        return null;
      }

      const totalPredictions = predictions.length;
      const homeWinPredictions = predictions.filter(p => p.prediction_home_score > p.prediction_away_score).length;
      const awayWinPredictions = predictions.filter(p => p.prediction_away_score > p.prediction_home_score).length;

      const avgHomeScore = Math.round(predictions.reduce((sum, p) => sum + p.prediction_home_score, 0) / totalPredictions * 10) / 10;
      const avgAwayScore = Math.round(predictions.reduce((sum, p) => sum + p.prediction_away_score, 0) / totalPredictions * 10) / 10;

      // Calculate margin ranges
      const margins = predictions.map(p => Math.abs(p.prediction_home_score - p.prediction_away_score));
      const marginRange = getMarginRange(Math.round(margins.reduce((a, b) => a + b) / margins.length));

      // Calculate total points ranges
      const totalPoints = predictions.map(p => p.prediction_home_score + p.prediction_away_score);
      const avgTotalPoints = Math.round(totalPoints.reduce((a, b) => a + b) / totalPoints.length);
      const totalPointsRange = getTotalPointsRange(avgTotalPoints);

      console.log('Processed upcoming game insights:', {
        totalPredictions,
        homeWinPredictions,
        awayWinPredictions,
        avgHomeScore,
        avgAwayScore,
        marginRange,
        totalPointsRange
      });

      return {
        totalPredictions,
        homeWinPredictions,
        awayWinPredictions,
        avgHomeScore,
        avgAwayScore,
        marginRange,
        totalPointsRange
      };
    },
    enabled: !!gameId,
    refetchInterval: 30000 // Refetch every 30 seconds to get new predictions
  });
}

function getMarginRange(margin: number): string {
  if (margin <= 5) return 'Close (1-5)';
  if (margin <= 10) return 'Moderate (6-10)';
  return 'Wide (10+)';
}

function getTotalPointsRange(total: number): string {
  if (total < 150) return 'Under 150';
  if (total < 165) return '150-165';
  return 'Over 165';
}