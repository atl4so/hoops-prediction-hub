import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Json } from "@/integrations/supabase/types";

interface LastGameResult {
  home_score: number;
  away_score: number;
  game_date: string;
  is_home: boolean;
}

interface GameInsights {
  total_predictions: number;
  home_win_predictions: number;
  away_win_predictions: number;
  avg_home_score: number;
  avg_away_score: number;
  common_margin_range: string;
  common_total_points_range: string;
  last_game_result: LastGameResult;
}

interface PredictionInsightsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
}

export function PredictionInsightsDialog({ isOpen, onOpenChange, gameId }: PredictionInsightsDialogProps) {
  const { data: insights, isLoading } = useQuery({
    queryKey: ['game-insights', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          prediction_home_score,
          prediction_away_score,
          points_earned,
          game:games (
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey (
              id,
              name
            ),
            away_team:teams!games_away_team_id_fkey (
              id,
              name
            ),
            game_results (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .eq('game_id', gameId);
      
      if (error) throw error;

      // Calculate insights from predictions
      const totalPredictions = data.length;
      const homeWinPredictions = data.filter(p => p.prediction_home_score > p.prediction_away_score).length;
      const awayWinPredictions = data.filter(p => p.prediction_home_score < p.prediction_away_score).length;

      // Calculate average scores
      const avgHomeScore = data.reduce((acc, p) => acc + p.prediction_home_score, 0) / totalPredictions;
      const avgAwayScore = data.reduce((acc, p) => acc + p.prediction_away_score, 0) / totalPredictions;

      // Calculate margin ranges
      const margins = data.map(p => Math.abs(p.prediction_home_score - p.prediction_away_score));
      const commonMargin = margins.reduce((acc, margin) => {
        if (margin <= 5) return 'Close (1-5)';
        if (margin <= 10) return 'Moderate (6-10)';
        return 'Wide (10+)';
      }, 'Close (1-5)');

      // Calculate total points ranges
      const totalPoints = data.map(p => p.prediction_home_score + p.prediction_away_score);
      const commonTotal = totalPoints.reduce((acc, total) => {
        if (total < 150) return 'Under 150';
        if (total < 165) return '150-165';
        return 'Over 165';
      }, 'Under 150');

      // Get game result if available
      const gameResult = data[0]?.game.game_results?.[0];
      const lastGameResult = gameResult ? {
        home_score: gameResult.home_score,
        away_score: gameResult.away_score,
        game_date: data[0].game.game_date,
        is_home: true // Simplified for now
      } : null;

      return {
        total_predictions: totalPredictions,
        home_win_predictions: homeWinPredictions,
        away_win_predictions: awayWinPredictions,
        avg_home_score: Number(avgHomeScore.toFixed(1)),
        avg_away_score: Number(avgAwayScore.toFixed(1)),
        common_margin_range: commonMargin,
        common_total_points_range: commonTotal,
        last_game_result: lastGameResult
      } as GameInsights;
    },
    enabled: isOpen
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How Others Predict</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : insights ? (
          <div className="space-y-6">
            {/* Basic Numbers */}
            <section className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Basic Numbers</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Total Predictions:</div>
                <div className="font-medium">{insights.total_predictions}</div>
                <div>Home Win Predictions:</div>
                <div className="font-medium">{insights.home_win_predictions}</div>
                <div>Away Win Predictions:</div>
                <div className="font-medium">{insights.away_win_predictions}</div>
                <div>Average Score:</div>
                <div className="font-medium">
                  {insights.avg_home_score} - {insights.avg_away_score}
                </div>
              </div>
            </section>

            {/* Prediction Patterns */}
            <section className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Prediction Patterns</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Common Margin:</div>
                <div className="font-medium">{insights.common_margin_range}</div>
                <div>Total Points Range:</div>
                <div className="font-medium">{insights.common_total_points_range}</div>
              </div>
            </section>

            {/* Recent Game */}
            {insights.last_game_result && (
              <section className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">Recent Game</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Last Game:</div>
                  <div className="font-medium">
                    {insights.last_game_result.home_score} - {insights.last_game_result.away_score}
                  </div>
                  <div>Played:</div>
                  <div className="font-medium">
                    {format(new Date(insights.last_game_result.game_date), 'MMM d, yyyy')}
                  </div>
                  <div>Position:</div>
                  <div className="font-medium">
                    {insights.last_game_result.is_home ? 'Home' : 'Away'}
                  </div>
                </div>
              </section>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}