import { Trophy, Target } from "lucide-react";
import { StatCard } from "./stats/StatCard";
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

  return (
    <div className="space-y-6 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={Trophy}
          label="Underdog Wins"
          value={stats?.underdog_wins || 0}
          subValue={`Avg. Margin: ${formatMargin(stats?.avg_upset_margin)}`}
          predictions={stats?.total_predictions}
          tooltip="Games won when less than 50% of users predicted a win. For example, if only 3 out of 10 users predicted a win and the team won, it counts as an underdog win."
          className="bg-green-50/50"
        />
        <StatCard
          icon={Target}
          label="Unexpected Losses"
          value={stats?.unexpected_losses || 0}
          subValue={`Avg. Margin: ${formatMargin(stats?.avg_loss_margin)}`}
          predictions={stats?.total_predictions}
          tooltip="Games lost when more than 50% of users predicted a win. For example, if 7 out of 10 users predicted a win but the team lost, it counts as an unexpected loss."
          className="bg-red-50/50"
        />
      </div>

      <MarginDistribution stats={stats} />
    </div>
  );
}