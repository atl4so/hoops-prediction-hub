import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PointsBreakdown() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Winner Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Correct prediction</span>
              <Badge>5 points</Badge>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Incorrect prediction</span>
              <span>0 points</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Point Difference</CardTitle>
        </CardHeader>
        <CardContent>
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
                <Badge variant="secondary">{item.points} points</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}