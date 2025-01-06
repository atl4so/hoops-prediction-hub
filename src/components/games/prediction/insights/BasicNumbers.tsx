import { Card, CardContent } from "@/components/ui/card";
import { Home, Plane } from "lucide-react";

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
  const homeWinPercentage = Math.round((homeWinPredictions / totalPredictions) * 100);
  const awayWinPercentage = Math.round((awayWinPredictions / totalPredictions) * 100);
  const drawPercentage = 100 - homeWinPercentage - awayWinPercentage;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Numbers</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Win Predictions</p>
              <div className="flex justify-center items-center gap-4">
                <div className="text-center">
                  <Home className="w-4 h-4 text-green-500 mx-auto" />
                  <p className="text-xl font-bold">{homeWinPercentage}%</p>
                  <p className="text-xs text-muted-foreground">Home</p>
                </div>
                {drawPercentage > 0 && (
                  <div className="text-center">
                    <div className="w-4 h-4 mx-auto" />
                    <p className="text-xl font-bold">{drawPercentage}%</p>
                    <p className="text-xs text-muted-foreground">Draw</p>
                  </div>
                )}
                <div className="text-center">
                  <Plane className="w-4 h-4 text-red-500 mx-auto" />
                  <p className="text-xl font-bold">{awayWinPercentage}%</p>
                  <p className="text-xs text-muted-foreground">Away</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Average Score</p>
              <p className="text-2xl font-bold">
                {avgHomeScore} - {avgAwayScore}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {totalPredictions} predictions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Common Margin</p>
              <p className="text-2xl font-bold">{commonMargin}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Home Wins</p>
                  <p className="font-medium">+{avgHomeWinMargin}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Away Wins</p>
                  <p className="font-medium">+{avgAwayWinMargin}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}