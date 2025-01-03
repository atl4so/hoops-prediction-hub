import { Award, Target, Home, Plane, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
  points: number;
  isOwnPrediction?: boolean;
}

export function PointsBreakdown({ prediction, result, points, isOwnPrediction = false }: PointsBreakdownProps) {
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
    <div className="space-y-4">
      {/* Score comparison */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-accent/10 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Prediction</p>
          <p className="text-xl font-semibold">{prediction.prediction_home_score} - {prediction.prediction_away_score}</p>
        </div>
        <div className="flex items-center justify-center">
          {predictedWinnerCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Result</p>
          <p className="text-xl font-semibold">{result.home_score} - {result.away_score}</p>
        </div>
      </div>

      {/* Points breakdown */}
      <div className="space-y-3 bg-card p-4 rounded-lg">
        <PointRow
          icon={<Award className="w-4 h-4" />}
          label="Winner prediction"
          points={winnerPoints}
          maxPoints={5}
          success={winnerPoints > 0}
        />
        <PointRow
          icon={<Target className="w-4 h-4" />}
          label="Point difference"
          points={diffPoints}
          maxPoints={25}
          success={diffPoints > 0}
        />
        <PointRow
          icon={<Home className="w-4 h-4" />}
          label="Home team score"
          points={homeScorePoints}
          maxPoints={10}
          success={homeScorePoints > 0}
        />
        <PointRow
          icon={<Plane className="w-4 h-4" />}
          label="Away team score"
          points={awayScorePoints}
          maxPoints={10}
          success={awayScorePoints > 0}
        />
        
        {/* Total points */}
        <div className="pt-2 mt-2 border-t">
          <div className="flex items-center justify-between font-semibold">
            <span>Total Points</span>
            <span className="text-lg text-primary">{points}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PointRow({ icon, label, points, maxPoints, success }: { 
  icon: React.ReactNode;
  label: string;
  points: number;
  maxPoints: number;
  success: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={cn(
          "p-1 rounded-md",
          success ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted"
        )}>
          {icon}
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className={cn(
          "font-medium",
          success ? "text-primary" : "text-muted-foreground"
        )}>
          {points}
        </span>
        <span className="text-sm text-muted-foreground">/ {maxPoints}</span>
      </div>
    </div>
  );
}
