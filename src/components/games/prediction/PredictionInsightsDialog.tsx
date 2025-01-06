import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BasicNumbers } from "./insights/BasicNumbers";
import { PredictionPatterns } from "./insights/PredictionPatterns";
import { useGameInsights } from "./insights/useGameInsights";

interface PredictionInsightsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
}

export function PredictionInsightsDialog({
  isOpen,
  onOpenChange,
  gameId
}: PredictionInsightsDialogProps) {
  const { data: insights, isLoading } = useGameInsights(gameId);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading insights...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (!insights || insights.totalPredictions === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No predictions yet</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const isFinished = insights.gameResult?.is_final;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            {isFinished ? 'How Others Predicted' : 'How Others Predict'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <BasicNumbers
            totalPredictions={insights.totalPredictions}
            homeWinPredictions={insights.homeWinPredictions}
            awayWinPredictions={insights.awayWinPredictions}
            avgHomeScore={insights.avgHomeScore}
            avgAwayScore={insights.avgAwayScore}
            gameResult={insights.gameResult}
          />

          <PredictionPatterns
            marginRange={insights.marginRange}
            totalPointsRange={insights.totalPointsRange}
            gameResult={insights.gameResult}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}