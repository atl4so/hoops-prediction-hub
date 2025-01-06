import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpDown, Scale } from "lucide-react";

interface PredictionPatternsProps {
  marginRange: string;
  totalPointsRange: string;
  gameResult?: {
    home_score: number;
    away_score: number;
    is_final: boolean;
  };
}

export function PredictionPatterns({
  marginRange,
  totalPointsRange,
  gameResult
}: PredictionPatternsProps) {
  const actualMargin = gameResult ? Math.abs(gameResult.home_score - gameResult.away_score) : null;
  const actualTotal = gameResult ? gameResult.home_score + gameResult.away_score : null;
  
  const getActualMarginRange = () => {
    if (!actualMargin) return null;
    if (actualMargin <= 5) return 'Close (1-5)';
    if (actualMargin <= 10) return 'Moderate (6-10)';
    return 'Wide (10+)';
  };

  const getActualTotalRange = () => {
    if (!actualTotal) return null;
    if (actualTotal < 150) return 'Under 150';
    if (actualTotal < 165) return '150-165';
    return 'Over 165';
  };

  const actualMarginRange = getActualMarginRange();
  const actualTotalRange = getActualTotalRange();

  return (
    <Card className="bg-card border-2 border-primary/20">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-lg text-primary/80">Prediction Patterns</h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-primary/60" />
                <span className="text-muted-foreground">Most Predicted Margin:</span>
              </div>
              <span className="font-semibold">{marginRange}</span>
            </div>
            {actualMarginRange && (
              <div className="text-xs text-muted-foreground pl-6">
                Actual: <span className={`font-medium ${actualMarginRange === marginRange ? 'text-primary' : ''}`}>
                  {actualMarginRange}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary/60" />
                <span className="text-muted-foreground">Total Points Range:</span>
              </div>
              <span className="font-semibold">{totalPointsRange}</span>
            </div>
            {actualTotalRange && (
              <div className="text-xs text-muted-foreground pl-6">
                Actual: <span className={`font-medium ${actualTotalRange === totalPointsRange ? 'text-primary' : ''}`}>
                  {actualTotalRange}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}