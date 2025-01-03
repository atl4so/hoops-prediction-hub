import { StatsList } from "./stats/StatsList";
import { RoundPerformance } from "./stats/RoundPerformance";
import type { StatsListProps } from "@/types/supabase";

export function StatsOverview(props: StatsListProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <StatsList {...props} />
      </div>
      <RoundPerformance userId={props.userId} />
    </div>
  );
}