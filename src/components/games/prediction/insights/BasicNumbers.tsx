import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BasicNumbersProps {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  gameResult?: {
    home_score: number;
    away_score: number;
    is_final: boolean;
  };
}

export function BasicNumbers({
  totalPredictions,
  homeWinPredictions,
  awayWinPredictions,
  avgHomeScore,
  avgAwayScore,
  gameResult
}: BasicNumbersProps) {
  const homeWinPercentage = Math.round((homeWinPredictions / totalPredictions) * 100) || 0;
  const awayWinPercentage = Math.round((awayWinPredictions / totalPredictions) * 100) || 0;

  const isFinished = gameResult?.is_final;

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Win Predictions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Home Win</p>
            <p className="text-2xl font-bold">{homeWinPercentage}%</p>
            {isFinished && gameResult.home_score > gameResult.away_score && (
              <p className="text-xs text-green-500 mt-1">Correct ✓</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Away Win</p>
            <p className="text-2xl font-bold">{awayWinPercentage}%</p>
            {isFinished && gameResult.away_score > gameResult.home_score && (
              <p className="text-xs text-green-500 mt-1">Correct ✓</p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Average Score Prediction</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Home Score</p>
            <p className="text-2xl font-bold">{Math.round(avgHomeScore)}</p>
            {isFinished && (
              <p className={cn(
                "text-xs mt-1",
                Math.abs(avgHomeScore - gameResult.home_score) <= 5 ? "text-green-500" : "text-muted-foreground"
              )}>
                Actual: {gameResult.home_score}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Away Score</p>
            <p className="text-2xl font-bold">{Math.round(avgAwayScore)}</p>
            {isFinished && (
              <p className={cn(
                "text-xs mt-1",
                Math.abs(avgAwayScore - gameResult.away_score) <= 5 ? "text-green-500" : "text-muted-foreground"
              )}>
                Actual: {gameResult.away_score}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">Total Predictions</h3>
        <p className="text-2xl font-bold">{totalPredictions}</p>
      </Card>
    </div>
  );
}