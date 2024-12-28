import { Award, Target, Home, Plane } from "lucide-react";

interface PointsBreakdownProps {
  prediction: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  };
  result: {
    home_score: number;
    away_score: number;
  };
}

export function PointsBreakdown({ prediction, result }: PointsBreakdownProps) {
  // Calculate point differences for explanation
  const predDiff = Math.abs(prediction.prediction_home_score - prediction.prediction_away_score);
  const actualDiff = Math.abs(result.home_score - result.away_score);
  const diffGap = Math.abs(predDiff - actualDiff);
  const homeGap = Math.abs(prediction.prediction_home_score - result.home_score);
  const awayGap = Math.abs(prediction.prediction_away_score - result.away_score);

  // Determine if winner was predicted correctly
  const predictedWinnerCorrect = 
    (prediction.prediction_home_score > prediction.prediction_away_score && result.home_score > result.away_score) ||
    (prediction.prediction_home_score < prediction.prediction_away_score && result.home_score < result.away_score) ||
    (prediction.prediction_home_score === prediction.prediction_away_score && result.home_score === result.away_score);

  // Calculate individual point components
  const winnerPoints = predictedWinnerCorrect ? 5 : 0;
  
  let diffPoints = 0;
  if (predictedWinnerCorrect) {
    if (diffGap === 0) diffPoints = 25;
    else if (diffGap === 1) diffPoints = 18;
    else if (diffGap === 2) diffPoints = 15;
    else if (diffGap === 3) diffPoints = 12;
    else if (diffGap === 4) diffPoints = 10;
    else if (diffGap === 5) diffPoints = 8;
    else if (diffGap === 6) diffPoints = 6;
    else if (diffGap === 7) diffPoints = 4;
    else if (diffGap === 8) diffPoints = 2;
    else if (diffGap === 9) diffPoints = 1;
  }

  let homeScorePoints = 0;
  let awayScorePoints = 0;
  if (predictedWinnerCorrect) {
    if (homeGap === 0) homeScorePoints = 10;
    else if (homeGap === 1) homeScorePoints = 9;
    else if (homeGap === 2) homeScorePoints = 8;
    else if (homeGap === 3) homeScorePoints = 7;
    else if (homeGap === 4) homeScorePoints = 6;
    else if (homeGap === 5) homeScorePoints = 5;
    else if (homeGap === 6) homeScorePoints = 4;
    else if (homeGap === 7) homeScorePoints = 3;
    else if (homeGap === 8) homeScorePoints = 2;
    else if (homeGap === 9) homeScorePoints = 1;

    if (awayGap === 0) awayScorePoints = 10;
    else if (awayGap === 1) awayScorePoints = 9;
    else if (awayGap === 2) awayScorePoints = 8;
    else if (awayGap === 3) awayScorePoints = 7;
    else if (awayGap === 4) awayScorePoints = 6;
    else if (awayGap === 5) awayScorePoints = 5;
    else if (awayGap === 6) awayScorePoints = 4;
    else if (awayGap === 7) awayScorePoints = 3;
    else if (awayGap === 8) awayScorePoints = 2;
    else if (awayGap === 9) awayScorePoints = 1;
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <p className="font-medium">Your Prediction: {prediction.prediction_home_score} - {prediction.prediction_away_score}</p>
        <p className="font-medium">Final Result: {result.home_score} - {result.away_score}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-primary" />
          <span>Winner prediction: {winnerPoints} points</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Target className="w-4 h-4 text-primary" />
          <span>Point difference: {diffPoints} points</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Home className="w-4 h-4 text-primary" />
          <span>Home team score: {homeScorePoints} points</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Plane className="w-4 h-4 text-primary" />
          <span>Away team score: {awayScorePoints} points</span>
        </div>

        <div className="pt-2 border-t">
          <p className="text-lg font-semibold text-primary flex items-center gap-2">
            <Award className="w-5 h-5" />
            Total: {prediction.points_earned || 0}
          </p>
        </div>
      </div>
    </div>
  );
}