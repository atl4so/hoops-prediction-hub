import { StatsOverview } from "../StatsOverview";
import { HomeAwayStats } from "../stats/HomeAwayStats";
import type { StatsListProps } from "@/types/supabase";

export function DashboardStats(props: StatsListProps) {
  return (
    <div className="space-y-8">
      <StatsOverview {...props} />
      <HomeAwayStats userId={props.userId} />
    </div>
  );
}