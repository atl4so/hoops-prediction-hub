import { Card, CardContent } from "@/components/ui/card";
import { Scale } from "lucide-react";

interface PredictionPatternsProps {
  marginRange: string;
  totalPointsRange: string;
}

export function PredictionPatterns({
  marginRange,
  totalPointsRange,
}: PredictionPatternsProps) {
  return (
    <Card className="bg-card border-2 border-primary/20">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-lg text-primary/80">Prediction Patterns</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Common Margin:</span>
            <span className="font-semibold">{marginRange}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Points Range:</span>
            <span className="font-semibold">{totalPointsRange}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}