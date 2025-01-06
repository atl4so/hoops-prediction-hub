import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BasicNumbers } from "./insights/BasicNumbers";
import { PredictionPatterns } from "./insights/PredictionPatterns";
import { useGameInsights } from "./insights/useGameInsights";

interface PredictionInsightsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  finalScore?: {
    home: number;
    away: number;
  };
}

export function PredictionInsightsDialog({
  isOpen,
  onOpenChange,
  gameId,
  finalScore
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

  if (!insights) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Game Insights
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <BasicNumbers
            totalPredictions={insights.totalPredictions}
            homeWinPredictions={insights.homeWinPredictions}
            awayWinPredictions={insights.awayWinPredictions}
            avgHomeScore={insights.avgHomeScore}
            avgAwayScore={insights.avgAwayScore}
            commonMargin={insights.commonMargin}
            homeWinMargin={insights.homeWinMargin}
            awayWinMargin={insights.awayWinMargin}
            finalScore={finalScore}
          />

          <PredictionPatterns
            marginRange={insights.marginRange}
            totalPointsRange={insights.totalPointsRange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}