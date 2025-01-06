import { Card, CardContent } from "@/components/ui/card";

interface BasicNumbersProps {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  commonMargin: string;
  avgHomeWinMargin: number;
  avgAwayWinMargin: number;
}

export function BasicNumbers({
  totalPredictions,
  homeWinPredictions,
  awayWinPredictions,
  avgHomeScore,
  avgAwayScore,
  commonMargin,
  avgHomeWinMargin = 0,
  avgAwayWinMargin = 0,
}: BasicNumbersProps) {
  const homeWinPercentage = totalPredictions > 0 
    ? ((homeWinPredictions / totalPredictions) * 100).toFixed(1) 
    : "0.0";
  const awayWinPercentage = totalPredictions > 0 
    ? ((awayWinPredictions / totalPredictions) * 100).toFixed(1) 
    : "0.0";

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Predictions:</span>
            <span className="font-semibold">{totalPredictions}</span>
          </div>
          
          <div className="border-t pt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-muted-foreground">Home Win Predictions:</span>
              <span className="font-semibold">{homeWinPercentage}%</span>
            </div>
            <div className="flex justify-between items-center text-sm pl-4">
              <span className="text-muted-foreground">Avg Margin:</span>
              <span className="font-medium">{avgHomeWinMargin ? avgHomeWinMargin.toFixed(1) : '0'} pts</span>
            </div>
          </div>
          
          <div className="border-t pt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-muted-foreground">Away Win Predictions:</span>
              <span className="font-semibold">{awayWinPercentage}%</span>
            </div>
            <div className="flex justify-between items-center text-sm pl-4">
              <span className="text-muted-foreground">Avg Margin:</span>
              <span className="font-medium">{avgAwayWinMargin ? avgAwayWinMargin.toFixed(1) : '0'} pts</span>
            </div>
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Common Margin:</span>
              <span className="font-semibold">{commonMargin}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground whitespace-nowrap">Average Score:</span>
              <span className="font-semibold whitespace-nowrap">
                {avgHomeScore ? avgHomeScore.toFixed(1) : '0'} - {avgAwayScore ? avgAwayScore.toFixed(1) : '0'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}