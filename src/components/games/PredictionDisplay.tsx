interface PredictionDisplayProps {
  homeScore: number;
  awayScore: number;
  pointsEarned?: number;
}

export function PredictionDisplay({ homeScore, awayScore, pointsEarned }: PredictionDisplayProps) {
  return (
    <div className="text-sm text-center space-y-1">
      <p className="font-medium">Your Prediction</p>
      <p>
        {homeScore} - {awayScore}
      </p>
      {pointsEarned !== undefined && (
        <p className="text-primary">Points: {pointsEarned}</p>
      )}
    </div>
  );
}