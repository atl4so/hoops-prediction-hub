import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Users } from "lucide-react";

interface BasicNumbersProps {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  commonMargin: number;
  homeWinMargin: number;
  awayWinMargin: number;
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
}: BasicNumbersProps) {
  // Calculate percentages
  const homeWinPercentage = ((homeWinPredictions / totalPredictions) * 100).toFixed(1);
  const awayWinPercentage = ((awayWinPredictions / totalPredictions) * 100).toFixed(1);

  const top3Predictors = [
    { name: "John Doe", points: 45 },
    { name: "Jane Smith", points: 42 },
    { name: "Bob Wilson", points: 38 },
  ];

  return (
    <div className="grid gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-orange-500" />
            <h3 className="font-semibold text-sm">Prediction Overview</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Predictions</p>
              <p className="text-xl font-bold">{totalPredictions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-xl font-bold">{avgHomeScore} - {avgAwayScore}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <h3 className="font-semibold text-sm text-green-700">Home Win</h3>
            </div>
            <p className="text-2xl font-bold">{homeWinPercentage}%</p>
            <p className="text-sm text-muted-foreground mt-1">
              Avg. Margin: {homeWinMargin} pts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDown className="h-4 w-4 text-blue-500" />
              <h3 className="font-semibold text-sm text-blue-700">Away Win</h3>
            </div>
            <p className="text-2xl font-bold">{awayWinPercentage}%</p>
            <p className="text-sm text-muted-foreground mt-1">
              Avg. Margin: {awayWinMargin} pts
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20">
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm text-orange-600 mb-3">Top Predictors</h3>
          <div className="space-y-2">
            {top3Predictors.map((predictor, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-orange-500">#{index + 1}</span>
                  <span className="text-sm">{predictor.name}</span>
                </div>
                <span className="text-sm font-semibold">{predictor.points} pts</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}