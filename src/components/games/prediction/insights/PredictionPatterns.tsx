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
    <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-sm text-orange-500/80">Prediction Patterns</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-orange-500/60" />
              <span className="text-sm text-muted-foreground">Average Margin</span>
            </div>
            <span className="font-semibold">{marginRange} points</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-orange-500/60" />
              <span className="text-sm text-muted-foreground">Total Points Range</span>
            </div>
            <span className="font-semibold">{totalPointsRange}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}