import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Calculator } from "lucide-react";

export function BasicCriteria() {
  return (
    <div className="glass-card p-6 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-display">Basic Criteria</CardTitle>
        <Badge variant="secondary" className="text-sm">Max 50 Points per Game</Badge>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mt-4">
        <div className="glass-card p-6 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold">Winner/Loser</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Correctly predicting the winning team earns you base points
          </p>
        </div>
        <div className="glass-card p-6 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold">Point Difference</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            The closer your predicted margin is to the actual result, the more points you earn
          </p>
        </div>
        <div className="glass-card p-6 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold">Team Scores</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Additional points for accurately predicting each team's final score
          </p>
        </div>
      </div>
    </div>
  );
}