import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BasicNumbers } from "./BasicNumbers";
import { PredictionPatterns } from "./PredictionPatterns";
import { useGameInsights } from "./useGameInsights";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const { data: insights, isLoading, error } = useGameInsights(gameId);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary/80" />
            <p className="mt-2 text-sm text-muted-foreground">Loading insights...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <Alert variant="destructive">
            <AlertDescription>
              There was an error loading the prediction insights. Please try again later.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  if (!insights) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">No predictions yet</h3>
            <p className="text-muted-foreground">
              Be the first to make a prediction for this game!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            How Others Predict
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <BasicNumbers
            totalPredictions={insights.totalPredictions}
            homeWinPredictions={insights.homeWinPredictions}
            awayWinPredictions={insights.awayWinPredictions}
            avgHomeScore={insights.avgHomeScore}
            avgAwayScore={insights.avgAwayScore}
            commonMargin={insights.commonMargin}
            avgHomeWinMargin={insights.avgHomeWinMargin}
            avgAwayWinMargin={insights.avgAwayWinMargin}
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