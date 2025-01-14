import { StatsList } from "./stats/StatsList";
import { RoundPerformance } from "./stats/RoundPerformance";
import { BestTeamsPredictions } from "./stats/BestTeamsPredictions";
import { WorstTeamsPredictions } from "./stats/WorstTeamsPredictions";
import type { StatsListProps } from "@/types/supabase";

export function StatsOverview(props: StatsListProps) {
  return (
    <div className="space-y-6 rounded-lg bg-accent/30 p-6 backdrop-blur-sm">
      <StatsList {...props} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BestTeamsPredictions userId={props.userId} />
        <WorstTeamsPredictions userId={props.userId} />
      </div>
      <RoundPerformance userId={props.userId} />
    </div>
  );
}