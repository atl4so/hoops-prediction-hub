import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";

interface BasicNumbersProps {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
}

export function BasicNumbers({
  totalPredictions,
  homeWinPredictions,
  awayWinPredictions,
  avgHomeScore,
  avgAwayScore,
}: BasicNumbersProps) {
  return (
    <Card className="bg-card border-2 border-primary/20">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-lg text-primary/80">Basic Numbers</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Predictions:</span>
            <span className="font-semibold">{totalPredictions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Home Win Predictions:</span>
            <span className="font-semibold">{homeWinPredictions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Away Win Predictions:</span>
            <span className="font-semibold">{awayWinPredictions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Average Predicted Score:</span>
            <span className="font-semibold">
              {avgHomeScore.toFixed(1)} - {avgAwayScore.toFixed(1)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}