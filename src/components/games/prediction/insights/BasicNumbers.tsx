import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface BasicNumbersProps {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  commonMargin: string;
  homeWinMargin?: string;
  awayWinMargin?: string;
  finalScore?: {
    home: number;
    away: number;
  };
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
  finalScore,
}: BasicNumbersProps) {
  const homeWinPercentage = ((homeWinPredictions / totalPredictions) * 100).toFixed(1);
  const awayWinPercentage = ((awayWinPredictions / totalPredictions) * 100).toFixed(1);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {finalScore && (
        <Card className="md:col-span-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Final Result</p>
                <p className="text-2xl font-bold">{finalScore.home} - {finalScore.away}</p>
              </div>
              <Trophy className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Predictions</span>
              <span className="font-semibold">{totalPredictions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Home Win Predictions</span>
              <span className="font-semibold">{homeWinPercentage}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Away Win Predictions</span>
              <span className="font-semibold">{awayWinPercentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Score</span>
              <span className="font-semibold">{avgHomeScore.toFixed(1)} - {avgAwayScore.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Overall Margin</span>
              <span className="font-semibold">{commonMargin}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">Predicted Margins</p>
          <div className="grid gap-2">
            {homeWinMargin && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Home Win By</span>
                <span className="font-semibold">{homeWinMargin}</span>
              </div>
            )}
            {awayWinMargin && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Away Win By</span>
                <span className="font-semibold">{awayWinMargin}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}