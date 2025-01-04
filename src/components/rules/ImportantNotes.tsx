import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock } from "lucide-react";

export function ImportantNotes() {
  return (
    <div className="glass-card p-6 rounded-lg space-y-6">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-orange-500" />
        <h3 className="text-2xl font-semibold font-display">Important Notes</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold">Final Score</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Points are awarded based on the final score, including any overtime periods.
          </p>
        </div>
        <div className="glass-card p-6 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold">Incorrect Winner</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            If the winner is predicted incorrectly, no points are awarded for point difference or team scores.
          </p>
        </div>
      </div>
    </div>
  );
}