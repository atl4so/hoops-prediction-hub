import { useQuery } from "@tanstack/react-query";
import { Users, CheckSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminStatsCard } from "./AdminStatsCard";

export function AdminStats() {
  // Query for total users count
  const { data: totalUsers } = useQuery({
    queryKey: ['totalUsers'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Query for total finished predictions
  const { data: totalPredictions } = useQuery({
    queryKey: ['totalPredictions'],
    queryFn: async () => {
      const { count } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .not('points_earned', 'is', null);
      return count || 0;
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      <AdminStatsCard
        title="Total Users"
        value={totalUsers || '...'}
        icon={Users}
      />
      <AdminStatsCard
        title="Finished Predictions"
        value={totalPredictions || '...'}
        icon={CheckSquare}
      />
    </div>
  );
}