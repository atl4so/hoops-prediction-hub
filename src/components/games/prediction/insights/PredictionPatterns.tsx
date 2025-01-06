import { Card, CardContent } from "@/components/ui/card";
import { ChartBar } from "lucide-react";

interface PredictionPatternsProps {
  marginRange: string;
  totalPointsRange: string;
}

export function PredictionPatterns({
  marginRange,
  totalPointsRange
}: PredictionPatternsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <ChartBar className="h-5 w-5 text-primary/80" />
          <h3 className="font-semibold">Prediction Patterns</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Most Common Margin</p>
            <p className="text-lg font-medium">{marginRange}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Points Range</p>
            <p className="text-lg font-medium">{totalPointsRange}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}