import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BasicCriteria() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Basic Criteria
          <Badge variant="secondary">Max 50 Points per Game</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Winner/Loser</h3>
            <p className="text-sm text-muted-foreground">Correctly predicting the winning team</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Point Difference</h3>
            <p className="text-sm text-muted-foreground">Accurately predicting the margin of victory</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Team Scores</h3>
            <p className="text-sm text-muted-foreground">Correctly guessing each team's points</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}