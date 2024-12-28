import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface PointsBreakdownDialogProps {
  isOpen: boolean;
  onClose: () => void;
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

export function PointsBreakdownDialog({
  isOpen,
  onClose,
  prediction,
  result,
}: PointsBreakdownDialogProps) {
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
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Points Breakdown</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="space-y-2">
              <p className="font-medium">Your Prediction: {prediction.prediction_home_score} - {prediction.prediction_away_score}</p>
              <p className="font-medium">Final Result: {result.home_score} - {result.away_score}</p>
            </div>

            <div className="space-y-2 text-sm">
              <p>Winner prediction: {winnerPoints} points</p>
              <p>Point difference: {diffPoints} points</p>
              <p>Home team score: {homeScorePoints} points</p>
              <p>Away team score: {awayScorePoints} points</p>
              <p className="text-primary font-medium pt-1">
                Total: {prediction.points_earned} points
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}