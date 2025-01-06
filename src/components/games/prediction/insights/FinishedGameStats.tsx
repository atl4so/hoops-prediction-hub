import { Card, CardContent } from "@/components/ui/card";
import { Target, TrendingUp } from "lucide-react";

interface FinishedGameStatsProps {
  predictions: Array<{
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned: number | null;
    profiles: {
      display_name: string;
      avatar_url: string | null;
    };
  }>;
  finalScore: {
    home: number;
    away: number;
  };
}

export function FinishedGameStats({ predictions, finalScore }: FinishedGameStatsProps) {
  const avgHomeScore = Math.round(
    predictions.reduce((sum, p) => sum + p.prediction_home_score, 0) / predictions.length
  );
  const avgAwayScore = Math.round(
    predictions.reduce((sum, p) => sum + p.prediction_away_score, 0) / predictions.length
  );

  const correctWinnerCount = predictions.filter(p => {
    const predictedHomeWin = p.prediction_home_score > p.prediction_away_score;
    const actualHomeWin = finalScore.home > finalScore.away;
    return predictedHomeWin === actualHomeWin;
  }).length;

  const winnerAccuracy = Math.round((correctWinnerCount / predictions.length) * 100);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary/80">
            <Target className="h-4 w-4" />
            <h3 className="font-semibold">Average Prediction</h3>
          </div>
          <div className="text-2xl font-bold">
            {avgHomeScore} - {avgAwayScore}
          </div>
          <div className="text-sm text-muted-foreground">
            Actual: {finalScore.home} - {finalScore.away}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary/80">
            <TrendingUp className="h-4 w-4" />
            <h3 className="font-semibold">Winner Prediction</h3>
          </div>
          <div className="text-2xl font-bold">
            {winnerAccuracy}%
          </div>
          <div className="text-sm text-muted-foreground">
            {correctWinnerCount} out of {predictions.length} correct
          </div>
        </CardContent>
      </Card>
    </div>
  );
}