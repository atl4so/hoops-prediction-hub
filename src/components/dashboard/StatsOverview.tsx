import { StatsList } from "./stats/StatsList";
import { RoundPerformance } from "./stats/RoundPerformance";
import { BestTeamsPredictions } from "./stats/BestTeamsPredictions";
import type { StatsListProps } from "@/types/supabase";

export function StatsOverview(props: StatsListProps) {
  return (
    <div className="space-y-6">
      <StatsList {...props} />
      <BestTeamsPredictions userId={props.userId} />
      <RoundPerformance userId={props.userId} />
    </div>
  );
}