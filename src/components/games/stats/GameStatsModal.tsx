import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface GameStatsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
}

export function GameStatsModal({ isOpen, onOpenChange, gameId }: GameStatsModalProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["game-stats", gameId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_game_prediction_insights', {
        game_id_param: gameId
      });
      
      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Game Statistics</h2>
          <div className="grid gap-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Prediction Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Total Predictions: {stats?.total_predictions || 0}</div>
                <div>Home Win Predictions: {stats?.home_win_predictions || 0}</div>
                <div>Away Win Predictions: {stats?.away_win_predictions || 0}</div>
                <div>Avg Home Score: {stats?.avg_home_score || 0}</div>
                <div>Avg Away Score: {stats?.avg_away_score || 0}</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-medium mb-2">Prediction Patterns</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Common Margin: {stats?.common_margin_range}</div>
                <div>Total Points Range: {stats?.total_points_range}</div>
                <div>Avg Home Win Margin: {stats?.avg_home_win_margin || 0}</div>
                <div>Avg Away Win Margin: {stats?.avg_away_win_margin || 0}</div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}