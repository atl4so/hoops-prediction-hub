import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

export function useUserPredictions(userId: string | null) {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();

  return useQuery({
    queryKey: ['userPredictions', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('predictions')
        .select(`
          *,
          game:games (
            *,
            home_team:teams!games_home_team_id_fkey (*),
            away_team:teams!games_away_team_id_fkey (*),
            round:rounds (*),
            game_results (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!session
  });
}