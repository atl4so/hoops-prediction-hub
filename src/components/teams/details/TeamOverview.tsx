import { Card, CardContent } from "@/components/ui/card";

interface TeamOverviewProps {
  stats: any;
  distribution: any[];
}

export function TeamOverview({ stats, distribution }: TeamOverviewProps) {
  return (
    <div className="space-y-6 py-4">
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Success Rates</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Overall</p>
              <p className="text-2xl font-semibold">{stats?.overall_success_rate || 0}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Home</p>
              <p className="text-2xl font-semibold">{stats?.home_success_rate || 0}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Away</p>
              <p className="text-2xl font-semibold">{stats?.away_success_rate || 0}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Result Distribution</h3>
          <div className="space-y-4">
            {distribution?.map((item) => (
              <div key={item.margin_range}>
                <p className="text-sm font-medium mb-2">{item.margin_range}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Wins</p>
                    <p className="text-xl font-semibold">{item.win_percentage}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Losses</p>
                    <p className="text-xl font-semibold">{item.loss_percentage}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}