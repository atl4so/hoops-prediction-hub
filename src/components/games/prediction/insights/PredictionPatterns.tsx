import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpDown, Scale } from "lucide-react";

interface PredictionPatternsProps {
  marginRange: string;
  totalPointsRange: string;
}

export function PredictionPatterns({
  marginRange,
  totalPointsRange,
}: PredictionPatternsProps) {
  return (
    <Card className="border-2 border-primary/10">
      <CardContent className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-primary/80 flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Prediction Patterns
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-primary/60" />
              <span className="text-muted-foreground">Average Margin</span>
            </div>
            <span className="font-semibold">{marginRange} points</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary/60" />
              <span className="text-muted-foreground">Total Points Range</span>
            </div>
            <span className="font-semibold">{totalPointsRange}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}