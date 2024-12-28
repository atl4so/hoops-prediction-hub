import { Trophy, Target, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";

interface StatsOverviewProps {
  totalPoints: number;
  pointsPerGame: number;
  totalPredictions: number;
}

export function StatsOverview({ totalPoints, pointsPerGame, totalPredictions }: StatsOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
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
    </div>
  );
}