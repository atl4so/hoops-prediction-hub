import { StatsList } from "./stats/StatsList";
import { RoundPerformance } from "./stats/RoundPerformance";
import { UserPredictionsGrid } from "./predictions/UserPredictionsGrid";
import type { StatsListProps } from "@/types/supabase";

export function StatsOverview(props: StatsListProps) {
  return (
    <div className="space-y-6">
      <StatsList {...props} />
      <UserPredictionsGrid userId={props.userId} isOwnPredictions={true} />
      <RoundPerformance userId={props.userId} />
    </div>
  );
}