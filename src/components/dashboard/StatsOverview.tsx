import { Trophy, Target, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { StatCard } from "./StatCard";

interface StatsOverviewProps {
  totalPoints: number;
  pointsPerGame: number;
  totalPredictions: number;
  highestGamePoints?: number | null;
  lowestGamePoints?: number | null;
  highestRoundPoints?: number | null;
  lowestRoundPoints?: number | null;
}

export function StatsOverview({ 
  totalPoints, 
  pointsPerGame, 
  totalPredictions,
  highestGamePoints,
  lowestGamePoints,
  highestRoundPoints,
  lowestRoundPoints
}: StatsOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-8">
      <StatCard
        icon={Trophy}
        label="Total Points"
        value={totalPoints || 0}
      />
      <StatCard
        icon={Target}
        label="Points per Game"
        value={(pointsPerGame || 0).toFixed(1)}
      />
      <StatCard
        icon={TrendingUp}
        label="Total Predictions"
        value={totalPredictions || 0}
      />
      <StatCard
        icon={ArrowUp}
        label="Highest Game Points"
        value={highestGamePoints || 0}
        description="Best single game prediction"
      />
      <StatCard
        icon={ArrowDown}
        label="Lowest Game Points"
        value={lowestGamePoints || 0}
        description="Worst single game prediction"
      />
      <StatCard
        icon={ArrowUp}
        label="Highest Round Points"
        value={highestRoundPoints || 0}
        description="Best round performance"
      />
      <StatCard
        icon={ArrowDown}
        label="Lowest Round Points"
        value={lowestRoundPoints || 0}
        description="Worst round performance"
      />
    </div>
  );
}