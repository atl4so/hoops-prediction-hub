import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { FinishedGameStats } from "./FinishedGameStats";

interface FinishedGameInsightsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  finalScore: {
    home: number;
    away: number;
  };
}

export function FinishedGameInsightsDialog({
  isOpen,
  onOpenChange,
  gameId,
  finalScore,
}: FinishedGameInsightsDialogProps) {
  const { data: predictions, isLoading } = useQuery({
    queryKey: ["finished-game-predictions", gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("predictions")
        .select(`
          prediction_home_score,
          prediction_away_score,
          points_earned,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq("game_id", gameId)
        .order("points_earned", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading predictions...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (!predictions?.length) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No predictions found</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  // Calculate basic stats
  const totalPredictions = predictions.length;
  const homeWinPredictions = predictions.filter(p => p.prediction_home_score > p.prediction_away_score).length;
  const awayWinPredictions = predictions.filter(p => p.prediction_home_score < p.prediction_away_score).length;
  const avgHomeScore = Math.round(predictions.reduce((sum, p) => sum + p.prediction_home_score, 0) / totalPredictions * 10) / 10;
  const avgAwayScore = Math.round(predictions.reduce((sum, p) => sum + p.prediction_away_score, 0) / totalPredictions * 10) / 10;

  // Calculate prediction patterns
  const margins = predictions.map(p => Math.abs(p.prediction_home_score - p.prediction_away_score));
  const avgMargin = margins.length > 0 
    ? Math.round(margins.reduce((a, b) => a + b) / margins.length * 10) / 10
    : 0;
  const commonMargin = avgMargin.toString();  // Just the number, "points" is part of the label

  const totalPoints = predictions.map(p => p.prediction_home_score + p.prediction_away_score);
  const minTotal = Math.min(...totalPoints);
  const maxTotal = Math.max(...totalPoints);
  const totalPointsRange = totalPoints.length > 0 ? `${minTotal}-${maxTotal}` : "N/A";

  // Get top 3 predictors
  const topPredictors = predictions
    .filter(p => p.points_earned !== null)
    .sort((a, b) => (b.points_earned || 0) - (a.points_earned || 0))
    .slice(0, 3);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            Game Insights
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          <FinishedGameStats
            predictions={predictions}
            finalScore={finalScore}
            basicStats={{
              totalPredictions,
              homeWinPredictions,
              awayWinPredictions,
              avgHomeScore,
              avgAwayScore,
              commonMargin,
              totalPointsRange
            }}
            topPredictors={topPredictors}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}