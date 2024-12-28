interface PredictionDisplayProps {
  homeScore: number;
  awayScore: number;
  pointsEarned?: number;
  onClick?: () => void;
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
      onClick={onClick}
    >
      <p className="font-medium">Your Prediction</p>
      <p>
        {homeScore} - {awayScore}
      </p>
      {pointsEarned !== undefined && (
        <div className="space-y-1">
          <p className="text-primary">Points: {pointsEarned}</p>
          {onClick && (
            <p className="text-xs text-muted-foreground hover:text-primary underline cursor-pointer">
              Click to see points breakdown
            </p>
          )}
        </div>
      )}
    </div>
  );
}