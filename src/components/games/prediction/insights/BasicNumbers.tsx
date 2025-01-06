import { Card, CardContent } from "@/components/ui/card";

interface BasicNumbersProps {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  commonMargin: string;
  homeWinMargin?: string;
  awayWinMargin?: string;
}

export function BasicNumbers({
  totalPredictions,
  homeWinPredictions,
  awayWinPredictions,
  avgHomeScore,
  avgAwayScore,
  commonMargin,
  homeWinMargin,
  awayWinMargin,
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
            <span className="text-muted-foreground">Home Win Predictions:</span>
            <span className="font-semibold">{homeWinPercentage}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Away Win Predictions:</span>
            <span className="font-semibold">{awayWinPercentage}%</span>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Overall Average Margin:</span>
              <span className="font-semibold">{commonMargin}</span>
            </div>
            {homeWinMargin && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted-foreground pl-4">• When Home Wins:</span>
                <span className="font-semibold">{homeWinMargin}</span>
              </div>
            )}
            {awayWinMargin && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted-foreground pl-4">• When Away Wins:</span>
                <span className="font-semibold">{awayWinMargin}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center flex-wrap pt-2 border-t">
            <span className="text-muted-foreground whitespace-nowrap">Average Predicted Score:</span>
            <span className="font-semibold whitespace-nowrap">{`${avgHomeScore.toFixed(1)} - ${avgAwayScore.toFixed(1)}`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}