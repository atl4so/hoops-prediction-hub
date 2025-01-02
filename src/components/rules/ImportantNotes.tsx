import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ImportantNotes() {
  return (
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
  );
}