import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BasicNumbers } from "./insights/BasicNumbers";
import { PredictionPatterns } from "./insights/PredictionPatterns";
import { useGameInsights } from "./insights/useGameInsights";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scroll } from "lucide-react";

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
      <DialogContent className="max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Scroll className="h-5 w-5 text-orange-500" />
            Game Insights
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-4rem)] px-6 pb-6">
          <div className="space-y-4">
            {finalScore && (
              <div className="rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-4 border border-orange-500/20">
                <h3 className="text-sm font-medium text-orange-600 mb-2">Final Score</h3>
                <p className="text-2xl font-bold text-center">
                  {finalScore.home} - {finalScore.away}
                </p>
              </div>
            )}

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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}