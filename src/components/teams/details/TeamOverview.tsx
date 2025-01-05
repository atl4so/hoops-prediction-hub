import { Trophy, Target, TrendingUp, TrendingDown } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

interface TeamOverviewProps {
  stats: any;
  distribution: any[];
}

export function TeamOverview({ stats, distribution }: TeamOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={TrendingUp}
          label="Total Wins Predicted"
          value={stats?.wins_predicted || 0}
          description={`${Math.round((stats?.wins_predicted / stats?.total_predictions) * 100 || 0)}% of all predictions`}
          highlight={true}
        />
        <StatCard
          icon={TrendingDown}
          label="Total Losses Predicted"
          value={stats?.losses_predicted || 0}
          description={`${Math.round((stats?.losses_predicted / stats?.total_predictions) * 100 || 0)}% of all predictions`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={Trophy}
          label="Underdog Wins"
          value={stats?.underdog_wins || 0}
          description={`Average margin: ${Math.round(stats?.avg_upset_margin || 0)} pts`}
        />
        <StatCard
          icon={Target}
          label="Unexpected Losses"
          value={stats?.unexpected_losses || 0}
          description={`Average margin: ${Math.round(stats?.avg_loss_margin || 0)} pts`}
        />
      </div>

      {distribution && distribution.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Result Distribution</h3>
          <div className="space-y-2">
            {distribution.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.margin_range}</span>
                  <span className="font-medium">
                    W: {item.win_percentage}% / L: {item.loss_percentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${item.win_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}