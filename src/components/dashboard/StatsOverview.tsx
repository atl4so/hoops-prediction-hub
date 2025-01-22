import { StatsList } from "./stats/StatsList";
import { RoundPerformance } from "./stats/RoundPerformance";
import { BestTeamsPredictions } from "./stats/BestTeamsPredictions";
import { WorstTeamsPredictions } from "./stats/WorstTeamsPredictions";
import type { StatsListProps } from "@/types/supabase";

export function StatsOverview(props: StatsListProps) {
  return (
    <div className="space-y-6">
      <StatsList {...props} />
      <RoundPerformance userId={props.userId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <BestTeamsPredictions userId={props.userId} />
        <WorstTeamsPredictions userId={props.userId} />
      </div>
    </div>
  );
}