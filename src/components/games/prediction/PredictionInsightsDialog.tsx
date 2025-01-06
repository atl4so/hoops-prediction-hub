import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BasicNumbers } from "./insights/BasicNumbers";
import { PredictionPatterns } from "./insights/PredictionPatterns";
import { useGameInsights } from "./insights/useGameInsights";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scroll, Trophy, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

            {insights.topPredictors && insights.topPredictors.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold text-lg">Top Predictors</h3>
                </div>
                <div className="space-y-3">
                  {insights.topPredictors.map((prediction, index) => (
                    <Card
                      key={index}
                      className={cn(
                        "transition-colors",
                        index === 0 ? "bg-yellow-500/10" :
                        index === 1 ? "bg-gray-400/10" :
                        index === 2 ? "bg-amber-600/10" : ""
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-3">
                              {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                              {index === 1 && <Trophy className="h-5 w-5 text-gray-400" />}
                              {index === 2 && <Trophy className="h-5 w-5 text-amber-600" />}
                              <Avatar className="h-6 w-6">
                                {prediction.profiles.avatar_url ? (
                                  <AvatarImage src={prediction.profiles.avatar_url} alt={prediction.profiles.display_name} />
                                ) : null}
                                <AvatarFallback>
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {prediction.profiles.display_name}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {prediction.prediction_home_score} - {prediction.prediction_away_score}
                            </span>
                            <span className="font-semibold">
                              {prediction.points_earned} pts
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}