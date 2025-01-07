import { Trophy, Target, TrendingUp, TrendingDown, Home, ExternalLink } from "lucide-react";
import { StatCard } from "@/components/dashboard/stats/StatCard";

interface TeamOverviewProps {
  stats: any;
  distribution: any[];
}

export function TeamOverview({ stats, distribution }: TeamOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Win/Loss Predictions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={TrendingUp}
          label="Total Wins Predicted"
          value={stats?.wins_predicted || 0}
          description={`${Math.round((stats?.wins_predicted / stats?.total_predictions) * 100 || 0)}% of all predictions`}
        />
        <StatCard
          icon={TrendingDown}
          label="Total Losses Predicted"
          value={stats?.losses_predicted || 0}
          description={`${Math.round((stats?.losses_predicted / stats?.total_predictions) * 100 || 0)}% of all predictions`}
        />
      </div>

      {/* Overall Win Rate */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={Trophy}
          label="Overall Win Rate"
          value={`${Math.round(stats?.overall_success_rate || 0)}%`}
          description={`${stats?.total_games || 0} games played`}
        />
        <StatCard
          icon={Target}
          label="Percentage Favoring Team"
          value={`${Math.round(stats?.percentage_favoring_team || 0)}%`}
          description={`${stats?.total_predictions || 0} total predictions`}
        />
      </div>

      {/* Home/Away Win Rates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={Home}
          label="Home Win Rate"
          value={`${Math.round(stats?.home_success_rate || 0)}%`}
          description={`${stats?.home_games || 0} home games`}
        />
        <StatCard
          icon={ExternalLink}
          label="Away Win Rate"
          value={`${Math.round(stats?.away_success_rate || 0)}%`}
          description={`${stats?.away_games || 0} away games`}
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