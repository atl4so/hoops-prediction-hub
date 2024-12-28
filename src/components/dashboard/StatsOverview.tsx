import { Trophy, Target, TrendingUp, ArrowUp, ArrowDown, Crown, Medal } from "lucide-react";
import { StatCard } from "./StatCard";

interface StatsOverviewProps {
  totalPoints: number;
  pointsPerGame: number;
  totalPredictions: number;
  highestGamePoints?: number | null;
  lowestGamePoints?: number | null;
  highestRoundPoints?: number | null;
  lowestRoundPoints?: number | null;
  allTimeRank?: number | null;
  currentRoundRank?: number | null;
}

export function StatsOverview({ 
  totalPoints, 
  pointsPerGame, 
  totalPredictions,
  highestGamePoints,
  lowestGamePoints,
  highestRoundPoints,
  lowestRoundPoints,
  allTimeRank,
  currentRoundRank
}: StatsOverviewProps) {
  const formatRank = (rank: number | null | undefined) => {
    if (!rank) return "-";
    const suffix = ["th", "st", "nd", "rd"];
    const v = rank % 100;
    return rank + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  };

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatCard
        icon={Trophy}
        label="Total Points"
        value={totalPoints || 0}
        description="Your cumulative points from all predictions"
        highlight={true}
      />
      <StatCard
        icon={Crown}
        label="All-Time Rank"
        value={formatRank(allTimeRank)}
        description="Your overall ranking among all players since the beginning"
        highlight={true}
      />
      <StatCard
        icon={Medal}
        label="Current Round Rank"
        value={formatRank(currentRoundRank)}
        description="Your current position in this round's leaderboard"
        highlight={true}
      />
      <StatCard
        icon={Target}
        label="Points per Game"
        value={(pointsPerGame || 0).toFixed(1)}
        description="Average points earned per prediction"
      />
      <StatCard
        icon={TrendingUp}
        label="Total Predictions"
        value={totalPredictions || 0}
        description="Number of predictions you've made so far"
      />
      <StatCard
        icon={ArrowUp}
        label="Highest Game Points"
        value={highestGamePoints || 0}
        description="Your best performance in a single game prediction"
      />
      <StatCard
        icon={ArrowDown}
        label="Lowest Game Points"
        value={lowestGamePoints || 0}
        description="Your lowest score in a single game prediction"
      />
      <StatCard
        icon={ArrowUp}
        label="Highest Round Points"
        value={highestRoundPoints || 0}
        description="Your best total points achieved in a single round"
      />
      <StatCard
        icon={ArrowDown}
        label="Lowest Round Points"
        value={lowestRoundPoints || 0}
        description="Your lowest total points in a completed round"
      />
    </div>
  );
}