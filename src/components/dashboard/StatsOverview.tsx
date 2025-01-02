import { StatsList } from "./stats/StatsList";
import { RoundPerformance } from "./stats/RoundPerformance";

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
  userId: string;
}

export function StatsOverview(props: StatsOverviewProps) {
  return (
    <div className="space-y-6">
      <StatsList {...props} />
      <RoundPerformance userId={props.userId} />
    </div>
  );
}