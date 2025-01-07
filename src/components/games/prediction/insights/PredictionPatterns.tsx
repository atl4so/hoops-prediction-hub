import { Card, CardContent } from "@/components/ui/card";
import { Scale, Target, Calculator } from "lucide-react";

interface PredictionPatternsProps {
  marginRange: string;
  totalPointsRange: string;
}

export function PredictionPatterns({
  marginRange,
  totalPointsRange,
}: PredictionPatternsProps) {
  // Calculate average from the range
  const [min, max] = totalPointsRange.split('-').map(Number);
  const avgTotalPoints = Math.round((min + max) / 2);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Prediction Patterns</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Target className="w-5 h-5 text-primary/80" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Common Margin Range</p>
              <p className="text-xl font-semibold">{marginRange}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center mb-2">
                <Scale className="w-5 h-5 text-primary/80" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Points Range</p>
                <p className="text-xl font-semibold">{totalPointsRange}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Total</p>
                <p className="text-lg font-medium text-primary">{avgTotalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}