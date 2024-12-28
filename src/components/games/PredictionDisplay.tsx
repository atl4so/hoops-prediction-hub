interface PredictionDisplayProps {
  homeScore: number;
  awayScore: number;
  pointsEarned?: number;
  onClick?: () => void;
  showBreakdownHint?: boolean;
}

export function PredictionDisplay({ 
  homeScore, 
  awayScore, 
  pointsEarned,
  onClick,
  showBreakdownHint = false
}: PredictionDisplayProps) {
  return (
    <div 
      className={cn(
        "text-sm text-center space-y-1",
        showBreakdownHint && "cursor-pointer hover:opacity-80 transition-opacity"
      )}
      onClick={onClick}
    >
      <p className="font-medium">Your Prediction</p>
      <p>
        {homeScore} - {awayScore}
      </p>
      {pointsEarned !== undefined && (
        <div className="space-y-1">
          <p className="text-primary">Points: {pointsEarned}</p>
          {showBreakdownHint && (
            <p className="text-xs text-muted-foreground hover:text-primary underline">
              Click to see points breakdown
            </p>
          )}
        </div>
      )}
    </div>
  );
}