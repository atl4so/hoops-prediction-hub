import { Trophy, Target } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { MarginDistribution } from "./stats/MarginDistribution";

interface TeamPredictionPatternsProps {
  stats: any;
}

export function TeamPredictionPatterns({ stats }: TeamPredictionPatternsProps) {
  // Format the margin value for display
  const formatMargin = (margin: number | null) => {
    if (margin === null || isNaN(margin)) return 'N/A';
    return `${Math.round(margin)} pts`;
  };

  // Calculate percentages for predictions
  const calculatePercentage = (value: number, total: number) => {
    if (!total) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <div className="space-y-6 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={Trophy}
          label="Underdog Wins"
          value={stats?.underdog_wins || 0}
          description={`Average margin: ${formatMargin(stats?.avg_upset_margin)}`}
          highlight={true}
        />
        <StatCard
          icon={Target}
          label="Unexpected Losses"
          value={stats?.unexpected_losses || 0}
          description={`Average margin: ${formatMargin(stats?.avg_loss_margin)}`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Underdog Win Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Win prediction rate:</span>
              <span className="font-medium">{calculatePercentage(stats?.underdog_wins || 0, stats?.total_games || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Users who predicted win:</span>
              <span className="font-medium">{Math.round(stats?.percentage_favoring_team || 0)}%</span>
            </div>
            <div className="text-xs text-muted-foreground">
              These are wins that occurred when less than 50% of users predicted this team would win. In other words, the team won despite being considered the underdog by the majority of predictors.
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Unexpected Loss Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Loss prediction rate:</span>
              <span className="font-medium">{calculatePercentage(stats?.unexpected_losses || 0, stats?.total_games || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Users who predicted win:</span>
              <span className="font-medium">{Math.round(stats?.percentage_favoring_team || 0)}%</span>
            </div>
            <div className="text-xs text-muted-foreground">
              These are losses that happened when more than 50% of users predicted this team would win. This means the team lost despite being favored to win by the majority of predictors.
            </div>
          </div>
        </div>
      </div>

      <MarginDistribution stats={stats} />
    </div>
  );
}