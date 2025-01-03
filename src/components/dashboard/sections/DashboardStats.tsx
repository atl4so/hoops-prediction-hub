import { StatsOverview } from "@/components/dashboard/StatsOverview";
import type { StatsListProps } from "@/types/supabase";

export function DashboardStats(props: StatsListProps) {
  return <StatsOverview {...props} />;
}