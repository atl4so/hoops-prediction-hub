interface PredictionDisplayProps {
  homeScore: number;
  awayScore: number;
  pointsEarned?: number;
  onClick?: () => void;  // Added onClick prop
}

export function PredictionDisplay({ 
  homeScore, 
  awayScore, 
  pointsEarned,
  onClick 
}: PredictionDisplayProps) {
  return (
    <div 
      className="text-sm text-center space-y-1"
      onClick={onClick}  // Added click handler
    >
      <p className="font-medium">Your Prediction</p>
      <p>
        {homeScore} - {awayScore}
      </p>
      {pointsEarned !== undefined && (
        <div className="space-y-1">
          <p className="text-primary">Points: {pointsEarned}</p>
          <p className="text-xs text-muted-foreground hover:text-primary cursor-pointer underline">
            Click to see points breakdown
          </p>
        </div>
      )}
    </div>
  );
}