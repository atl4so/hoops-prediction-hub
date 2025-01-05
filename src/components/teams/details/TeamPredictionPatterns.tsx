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
          subValue={`Avg. Margin: ${formatMargin(stats?.avg_upset_margin)}`}
          predictions={stats?.total_predictions}
          tooltip="Games won when less than 50% of users predicted a win"
          className="bg-green-50/50"
          details={[
            {
              label: "Win prediction rate",
              value: calculatePercentage(stats?.underdog_wins || 0, stats?.total_games || 0),
              tooltip: "Percentage of games won as underdog out of total games"
            },
            {
              label: "User predictions against",
              value: `${Math.round((stats?.percentage_favoring_team || 0))}%`,
              tooltip: "Average percentage of users who predicted against these wins"
            }
          ]}
        />
        <StatCard
          icon={Target}
          label="Unexpected Losses"
          value={stats?.unexpected_losses || 0}
          subValue={`Avg. Margin: ${formatMargin(stats?.avg_loss_margin)}`}
          predictions={stats?.total_predictions}
          tooltip="Games lost when more than 50% of users predicted a win"
          className="bg-red-50/50"
          details={[
            {
              label: "Loss prediction rate",
              value: calculatePercentage(stats?.unexpected_losses || 0, stats?.total_games || 0),
              tooltip: "Percentage of unexpected losses out of total games"
            },
            {
              label: "User predictions for",
              value: `${Math.round((stats?.percentage_favoring_team || 0))}%`,
              tooltip: "Average percentage of users who predicted wins in these losses"
            }
          ]}
        />
      </div>

      <MarginDistribution stats={stats} />
    </div>
  );
}