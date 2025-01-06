import { Card, CardContent } from "@/components/ui/card";
import { Home, Plane } from "lucide-react";

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
  const homeWinPercentage = Math.round((homeWinPredictions / totalPredictions) * 100);
  const awayWinPercentage = Math.round((awayWinPredictions / totalPredictions) * 100);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Current Predictions</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Win Predictions</p>
              <div className="flex justify-center items-center gap-4">
                <div className="text-center">
                  <Home className="w-4 h-4 text-primary mx-auto" />
                  <p className="text-xl font-bold">{homeWinPercentage}%</p>
                  <p className="text-xs text-muted-foreground">Home</p>
                </div>
                <div className="text-center">
                  <Plane className="w-4 h-4 text-primary mx-auto" />
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
              <p className="text-sm text-muted-foreground mb-2">Average Score Prediction</p>
              <p className="text-2xl font-bold">
                {avgHomeScore.toFixed(1)} - {avgAwayScore.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {totalPredictions} predictions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}