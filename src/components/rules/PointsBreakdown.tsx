import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Target } from "lucide-react";

export function PointsBreakdown() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="glass-card p-6 rounded-lg space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-orange-500" />
          <h3 className="text-xl font-semibold font-display">Winner Prediction</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Correct prediction</span>
            <Badge variant="secondary">5 points</Badge>
          </div>
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Incorrect prediction</span>
            <span>0 points</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-lg space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-orange-500" />
          <h3 className="text-xl font-semibold font-display">Point Difference</h3>
        </div>
        <div className="space-y-2">
          {[
            { diff: "Exact difference", points: 25 },
            { diff: "Within 1 point", points: 18 },
            { diff: "Within 2 points", points: 15 },
            { diff: "Within 3 points", points: 12 },
            { diff: "Within 4 points", points: 10 },
            { diff: "Within 5 points", points: 8 },
            { diff: "Within 6 points", points: 6 },
            { diff: "Within 7 points", points: 4 },
            { diff: "Within 8 points", points: 2 },
            { diff: "Within 9 points", points: 1 },
          ].map((item) => (
            <div key={item.points} className="flex justify-between items-center">
              <span>{item.diff}</span>
              <Badge variant="outline">{item.points} points</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}