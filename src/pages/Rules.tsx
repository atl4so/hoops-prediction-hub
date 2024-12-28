import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Rules() {
  return (
    <div className="container max-w-4xl mx-auto space-y-8 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Scoring Rules</h1>
      
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
              <div className="flex justify-between items-center">
                <span>Exact difference</span>
                <Badge variant="secondary">25 points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Within 1 point</span>
                <Badge variant="secondary">18 points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Within 2 points</span>
                <Badge variant="secondary">15 points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Within 3 points</span>
                <Badge variant="secondary">12 points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Within 4 points</span>
                <Badge variant="secondary">10 points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Within 5 points</span>
                <Badge variant="secondary">8 points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Within 6 points</span>
                <Badge variant="secondary">6 points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Within 7 points</span>
                <Badge variant="secondary">4 points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Within 8 points</span>
                <Badge variant="secondary">2 points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Within 9 points</span>
                <Badge variant="secondary">1 point</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                <div className="flex justify-between items-center">
                  <span>Exact score</span>
                  <Badge>10 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Within 1 point</span>
                  <Badge>9 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Within 2 points</span>
                  <Badge>8 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Within 3 points</span>
                  <Badge>7 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Within 4 points</span>
                  <Badge>6 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Within 5 points</span>
                  <Badge>5 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Within 6 points</span>
                  <Badge>4 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Within 7 points</span>
                  <Badge>3 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Within 8 points</span>
                  <Badge>2 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Within 9 points</span>
                  <Badge>1 point</Badge>
                </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Final Score</h3>
              <p className="text-sm text-muted-foreground">
                Points are awarded based on the final score, including any overtime periods.
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Incorrect Winner</h3>
              <p className="text-sm text-muted-foreground">
                If the winner is predicted incorrectly, no points are awarded for point difference or team scores.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}