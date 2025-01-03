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
      
      try {
        // Get user profile and calculate all-time rank
        const { data: rankings, error: rankingsError } = await supabase
          .from('profiles')
          .select('id, total_points')
          .order('total_points', { ascending: false });

        if (rankingsError) {
          console.error('Error fetching rankings:', rankingsError);
          throw rankingsError;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
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
      } catch (error) {
        console.error('Error in useUserProfile:', error);
        toast.error("Failed to load profile. Please try again.");
        throw error;
      }
    },
    enabled: !!userId && !!session,
    retry: 3,
    retryDelay: 1000
  });
}