import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, ArrowRight } from "lucide-react";

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
  const homeWinPercentage = ((homeWinPredictions / totalPredictions) * 100).toFixed(1);
  const awayWinPercentage = ((awayWinPredictions / totalPredictions) * 100).toFixed(1);

  return (
    <Card className="border-2 border-primary/10">
      <CardContent className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-primary/80 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Prediction Stats
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-accent rounded-lg">
            <span className="text-muted-foreground">Total Predictions</span>
            <span className="font-semibold">{totalPredictions}</span>
          </div>
          
          <div className="border-t pt-2 space-y-2">
            <div className="flex justify-between items-center p-2 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary/60" />
                <span className="text-muted-foreground">Home Win Predictions</span>
              </div>
              <span className="font-semibold">{homeWinPercentage}%</span>
            </div>
            <div className="flex justify-between items-center text-sm pl-8">
              <span className="text-muted-foreground">Avg Margin</span>
              <span className="font-medium">{avgHomeWinMargin ? avgHomeWinMargin.toFixed(1) : '0'} pts</span>
            </div>
          </div>
          
          <div className="border-t pt-2 space-y-2">
            <div className="flex justify-between items-center p-2 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary/60" />
                <span className="text-muted-foreground">Away Win Predictions</span>
              </div>
              <span className="font-semibold">{awayWinPercentage}%</span>
            </div>
            <div className="flex justify-between items-center text-sm pl-8">
              <span className="text-muted-foreground">Avg Margin</span>
              <span className="font-medium">{avgAwayWinMargin ? avgAwayWinMargin.toFixed(1) : '0'} pts</span>
            </div>
          </div>

          <div className="border-t pt-2 space-y-2">
            <div className="flex justify-between items-center p-2 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary/60" />
                <span className="text-muted-foreground">Common Margin</span>
              </div>
              <span className="font-semibold">{commonMargin}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-accent/50 rounded-lg">
              <span className="text-muted-foreground whitespace-nowrap">Average Score</span>
              <span className="font-semibold whitespace-nowrap">{`${avgHomeScore.toFixed(1)} - ${avgAwayScore.toFixed(1)}`}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}