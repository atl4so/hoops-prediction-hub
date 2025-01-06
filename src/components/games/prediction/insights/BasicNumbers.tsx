import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface BasicNumbersProps {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  commonMargin: string;
  avgHomeWinMargin?: number;
  avgAwayWinMargin?: number;
}

export function BasicNumbers({
  totalPredictions,
  homeWinPredictions,
  awayWinPredictions,
  avgHomeScore,
  avgAwayScore,
  commonMargin,
  avgHomeWinMargin,
  avgAwayWinMargin,
}: BasicNumbersProps) {
  const homeWinPercentage = ((homeWinPredictions / totalPredictions) * 100).toFixed(1);
  const awayWinPercentage = ((awayWinPredictions / totalPredictions) * 100).toFixed(1);

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Predictions:</span>
            <span className="font-semibold">{totalPredictions}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Home Win Predictions:</span>
            </div>
            <div className="text-right">
              <span className="font-semibold">{homeWinPercentage}%</span>
              {avgHomeWinMargin && (
                <div className="text-sm text-muted-foreground">
                  avg. margin: {avgHomeWinMargin} pts
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-red-500" />
              <span className="text-muted-foreground">Away Win Predictions:</span>
            </div>
            <div className="text-right">
              <span className="font-semibold">{awayWinPercentage}%</span>
              {avgAwayWinMargin && (
                <div className="text-sm text-muted-foreground">
                  avg. margin: {avgAwayWinMargin} pts
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Average Margin:</span>
            <span className="font-semibold">{commonMargin}</span>
          </div>

          <div className="flex justify-between items-center flex-wrap">
            <span className="text-muted-foreground whitespace-nowrap">Average Predicted Score:</span>
            <span className="font-semibold whitespace-nowrap">{`${avgHomeScore.toFixed(1)} - ${avgAwayScore.toFixed(1)}`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}