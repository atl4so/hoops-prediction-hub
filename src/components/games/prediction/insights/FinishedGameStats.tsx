import { Card, CardContent } from "@/components/ui/card";
import { Target, TrendingUp } from "lucide-react";
import { BasicNumbers } from "./BasicNumbers";
import { PredictionPatterns } from "./PredictionPatterns";

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
  // Calculate basic stats
  const totalPredictions = predictions.length;
  const homeWinPredictions = predictions.filter(p => p.prediction_home_score > p.prediction_away_score).length;
  const awayWinPredictions = predictions.filter(p => p.prediction_home_score < p.prediction_away_score).length;
  const avgHomeScore = Math.round(predictions.reduce((sum, p) => sum + p.prediction_home_score, 0) / totalPredictions * 10) / 10;
  const avgAwayScore = Math.round(predictions.reduce((sum, p) => sum + p.prediction_away_score, 0) / totalPredictions * 10) / 10;

  // Calculate prediction patterns
  const margins = predictions.map(p => Math.abs(p.prediction_home_score - p.prediction_away_score));
  const commonMargin = margins.length > 0 
    ? `${Math.round(margins.reduce((a, b) => a + b) / margins.length * 10) / 10} points` 
    : "N/A";

  const totalPoints = predictions.map(p => p.prediction_home_score + p.prediction_away_score);
  const minTotal = Math.min(...totalPoints);
  const maxTotal = Math.max(...totalPoints);
  const totalPointsRange = totalPoints.length > 0 ? `${minTotal}-${maxTotal}` : "N/A";

  // Get top 3 predictors
  const topPredictors = predictions
    .filter(p => p.points_earned !== null)
    .sort((a, b) => (b.points_earned || 0) - (a.points_earned || 0))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <BasicNumbers
        totalPredictions={totalPredictions}
        homeWinPredictions={homeWinPredictions}
        awayWinPredictions={awayWinPredictions}
        avgHomeScore={avgHomeScore}
        avgAwayScore={avgAwayScore}
      />

      <PredictionPatterns
        marginRange={commonMargin}
        totalPointsRange={totalPointsRange}
      />

      {topPredictors.length > 0 && (
        <Card className="bg-card border-2 border-primary/20">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-lg text-primary/80">Top Predictors</h3>
            <div className="space-y-3">
              {topPredictors.map((prediction, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {index + 1}. {prediction.profiles.display_name}
                  </span>
                  <span className="font-semibold">{prediction.points_earned} pts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}