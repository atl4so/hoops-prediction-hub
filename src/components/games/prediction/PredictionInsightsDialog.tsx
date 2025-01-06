import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Json } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, ArrowUp, Calendar, Home, Scale, Target } from "lucide-react";

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
  last_game_result: LastGameResult | null;
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
          <DialogTitle className="text-center">How Others Predict</DialogTitle>
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
            <Card className="bg-card border-2 border-primary/20">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Prediction Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Predictions</p>
                    <p className="text-2xl font-bold text-primary">{insights.total_predictions}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-bold text-primary">
                      {insights.avg_home_score} - {insights.avg_away_score}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Home Win</p>
                      <p className="font-semibold">{insights.home_win_predictions}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Away Win</p>
                      <p className="font-semibold">{insights.away_win_predictions}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prediction Patterns */}
            <Card className="bg-card border-2 border-primary/20">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Prediction Patterns
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Common Margin</p>
                    <p className="font-semibold">{insights.common_margin_range}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Points</p>
                    <p className="font-semibold">{insights.common_total_points_range}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Game */}
            {insights.last_game_result && (
              <Card className="bg-card border-2 border-primary/20">
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Recent Game
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="font-semibold">
                        {insights.last_game_result.home_score} - {insights.last_game_result.away_score}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Played</p>
                      <p className="font-semibold">
                        {format(new Date(insights.last_game_result.game_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Home className="h-4 w-4 text-primary" />
                      <p className="text-sm">
                        {insights.last_game_result.is_home ? 'Home' : 'Away'} Game
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}