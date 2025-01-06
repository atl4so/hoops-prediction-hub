import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Target } from "lucide-react";

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
  avgHomeWinMargin,
  avgAwayWinMargin
}: BasicNumbersProps) {
  const homeWinPercentage = Math.round((homeWinPredictions / totalPredictions) * 100) || 0;
  const awayWinPercentage = Math.round((awayWinPredictions / totalPredictions) * 100) || 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary/80" />
            <h3 className="font-semibold">Prediction Overview</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Predictions</p>
              <p className="text-2xl font-bold">{totalPredictions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Win Predictions</p>
              <div className="flex gap-2 text-sm">
                <span>Home: {homeWinPercentage}%</span>
                <span>Away: {awayWinPercentage}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary/80" />
            <h3 className="font-semibold">Score Predictions</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-lg">
                {avgHomeScore.toFixed(1)} - {avgAwayScore.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Win Margins</p>
              <div className="text-sm">
                <p>Home: {avgHomeWinMargin.toFixed(1)} pts</p>
                <p>Away: {avgAwayWinMargin.toFixed(1)} pts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}