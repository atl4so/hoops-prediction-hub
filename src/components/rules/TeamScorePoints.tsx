import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TeamScorePoints() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Score Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">
              Points awarded for accurately predicting each team's score:
            </p>
            <div className="space-y-2">
              {[
                { diff: "Exact score", points: 10 },
                { diff: "Within 1 point", points: 9 },
                { diff: "Within 2 points", points: 8 },
                { diff: "Within 3 points", points: 7 },
                { diff: "Within 4 points", points: 6 },
                { diff: "Within 5 points", points: 5 },
                { diff: "Within 6 points", points: 4 },
                { diff: "Within 7 points", points: 3 },
                { diff: "Within 8 points", points: 2 },
                { diff: "Within 9 points", points: 1 },
              ].map((item) => (
                <div key={item.points} className="flex justify-between items-center">
                  <span>{item.diff}</span>
                  <Badge>{item.points} points</Badge>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-sm">Example Calculation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Prediction: 81-88 (7 point difference)<br />
                Actual Score: 79-84 (5 point difference)
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Winner (correct)</span>
                  <Badge variant="outline">5 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Point Difference (2 off)</span>
                  <Badge variant="outline">15 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Team Scores (2 & 4 off)</span>
                  <Badge variant="outline">14 points</Badge>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <Badge>34 points</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}