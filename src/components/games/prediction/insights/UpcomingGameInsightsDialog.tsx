import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUpcomingGameInsights } from "./useUpcomingGameInsights";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Plane } from "lucide-react";

interface UpcomingGameInsightsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
}

export function UpcomingGameInsightsDialog({
  isOpen,
  onOpenChange,
  gameId
}: UpcomingGameInsightsDialogProps) {
  const { data: insights, isLoading, error } = useUpcomingGameInsights(gameId);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary/80" />
            <p className="mt-2 text-sm text-muted-foreground">Loading predictions...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Error Loading Insights</DialogTitle>
          </DialogHeader>
          <p className="text-center text-muted-foreground">
            There was an error loading the prediction insights. Please try again later.
          </p>
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
          <p className="text-center text-muted-foreground">
            Be the first to make a prediction for this game!
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  const homeWinPercentage = Math.round((insights.homeWinPredictions / insights.totalPredictions) * 100) || 0;
  const awayWinPercentage = Math.round((insights.awayWinPredictions / insights.totalPredictions) * 100) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            Current Predictions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Win Predictions</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="flex justify-center items-center gap-4">
                      <div className="text-center">
                        <Home className="w-4 h-4 text-primary mx-auto" />
                        <p className="text-xl font-bold">{homeWinPercentage}%</p>
                        <p className="text-xs text-muted-foreground">Home</p>
                      </div>
                      <div className="text-center">
                        <Plane className="w-4 h-4 text-primary mx-auto" />
                        <p className="text-xl font-bold">{awayWinPercentage}%</p>
                        <p className="text-xs text-muted-foreground">Away</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Average Score</p>
                    <p className="text-2xl font-bold">
                      {insights.avgHomeScore} - {insights.avgAwayScore}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on {insights.totalPredictions} predictions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Common Patterns</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Predicted Margin</p>
                    <p className="text-xl font-semibold">{insights.marginRange}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Total Points</p>
                    <p className="text-xl font-semibold">{insights.totalPointsRange}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}