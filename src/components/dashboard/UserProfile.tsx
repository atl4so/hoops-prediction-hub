import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

export function useUserProfile(userId: string | null) {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      // Get user profile and calculate all-time rank
      const { data: rankings } = await supabase
        .from('profiles')
        .select('id, total_points')
        .order('total_points', { ascending: false });

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error("Failed to load profile");
        return null;
      }

      // If no profile exists, sign out and redirect to home
      if (!profile) {
        await supabase.auth.signOut();
        navigate('/');
        return null;
      }

      if (!rankings) return null;

      // Calculate all-time rank
      const allTimeRank = rankings.findIndex(r => r.id === userId) + 1;

      return {
        ...profile,
        allTimeRank
      };
    },
    enabled: !!userId && !!session
  });
}