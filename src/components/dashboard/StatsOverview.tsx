import { StatsList } from "./stats/StatsList";
import { RoundPerformance } from "./stats/RoundPerformance";
import type { StatsListProps } from "@/types/supabase";
import { UserPredictionsGrid } from "./predictions/UserPredictionsGrid";
import { useUserPredictions } from "./useUserPredictions";

export function StatsOverview(props: StatsListProps) {
  const { data: predictions, isLoading: isLoadingPredictions } = useUserPredictions(props.userId);

  return (
    <div className="space-y-6">
      <StatsList {...props} />
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Your Predictions</h2>
        <div className="rounded-lg border">
          <UserPredictionsGrid predictions={predictions} isLoading={isLoadingPredictions} />
        </div>
      </div>
      <RoundPerformance userId={props.userId} />
    </div>
  );
}
