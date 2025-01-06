import { Card } from "@/components/ui/card";
import { Users2, Home, Plane } from "lucide-react";

interface BasicNumbersProps {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  gameResult?: {
    home_score: number;
    away_score: number;
    is_final: boolean;
  };
}

export function BasicNumbers({
  totalPredictions,
  homeWinPredictions,
  awayWinPredictions,
  avgHomeScore,
  avgAwayScore,
  gameResult
}: BasicNumbersProps) {
  const homeWinPercentage = Math.round((homeWinPredictions / totalPredictions) * 100);
  const awayWinPercentage = Math.round((awayWinPredictions / totalPredictions) * 100);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Users2 className="w-4 h-4" />
          <span className="text-sm font-medium">Predictions Overview</span>
        </div>
        <p className="text-2xl font-bold">{totalPredictions}</p>
        <p className="text-sm text-muted-foreground">total predictions</p>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home Win</span>
          </div>
          <p className="text-2xl font-bold">{homeWinPercentage}%</p>
          <p className="text-sm text-muted-foreground">{homeWinPredictions} predictions</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Plane className="w-4 h-4" />
            <span className="text-sm font-medium">Away Win</span>
          </div>
          <p className="text-2xl font-bold">{awayWinPercentage}%</p>
          <p className="text-sm text-muted-foreground">{awayWinPredictions} predictions</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Average Score Prediction</p>
          <p className="text-2xl font-bold">{avgHomeScore}-{avgAwayScore}</p>
          {gameResult?.is_final && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-sm font-medium text-muted-foreground">Final Score</p>
              <p className="text-xl font-semibold text-primary">
                {gameResult.home_score}-{gameResult.away_score}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}