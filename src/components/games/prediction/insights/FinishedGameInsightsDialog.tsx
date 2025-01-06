import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BasicNumbers } from "./BasicNumbers";
import { PredictionPatterns } from "./PredictionPatterns";
import { useGameInsights } from "./useGameInsights";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinishedGameInsightsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  finalScore?: {
    home: number;
    away: number;
  };
}

export function FinishedGameInsightsDialog({
  isOpen,
  onOpenChange,
  gameId,
  finalScore
}: FinishedGameInsightsDialogProps) {
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Prediction Insights
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Stats Section */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Overall Statistics</h3>
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
            </CardContent>
          </Card>

          {/* Top Predictors Section */}
          {insights.topPredictors && insights.topPredictors.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Top Predictors</h3>
                <div className="space-y-3">
                  {insights.topPredictors.slice(0, 3).map((predictor, index) => (
                    <div key={predictor.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/50">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index + 1)}
                        <span className="font-medium">{predictor.displayName}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "text-sm px-2 py-1 rounded",
                          predictor.points > 30 ? "bg-green-100 text-green-700" :
                          predictor.points > 20 ? "bg-blue-100 text-blue-700" :
                          "bg-orange-100 text-orange-700"
                        )}>
                          {predictor.points} pts
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {predictor.prediction.home} - {predictor.prediction.away}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Patterns Section */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Prediction Patterns</h3>
              <PredictionPatterns
                marginRange={insights.marginRange}
                totalPointsRange={insights.totalPointsRange}
              />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}