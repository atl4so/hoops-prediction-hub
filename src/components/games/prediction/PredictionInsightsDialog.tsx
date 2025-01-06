import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

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
        .rpc('get_game_prediction_insights', { game_id_param: gameId });
      
      if (error) throw error;
      return data;
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