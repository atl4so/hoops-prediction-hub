import { Card, CardContent } from "@/components/ui/card";

interface TeamPredictionPatternsProps {
  stats: any;
}

export function TeamPredictionPatterns({ stats }: TeamPredictionPatternsProps) {
  return (
    <div className="space-y-6 py-4">
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Underdog Wins</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Upsets</p>
              <p className="text-2xl font-semibold">{stats?.underdog_wins || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Margin</p>
              <p className="text-2xl font-semibold">
                {stats?.avg_upset_margin ? `${stats.avg_upset_margin} pts` : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Unexpected Losses</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Losses</p>
              <p className="text-2xl font-semibold">{stats?.unexpected_losses || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Margin</p>
              <p className="text-2xl font-semibold">
                {stats?.avg_loss_margin ? `${stats.avg_loss_margin} pts` : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}