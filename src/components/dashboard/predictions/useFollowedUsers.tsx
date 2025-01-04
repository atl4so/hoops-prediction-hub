import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFollowedUsers() {
  return useQuery({
    queryKey: ["followed-users"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      console.log('Current user:', user.id);

      const { data: follows, error } = await supabase
        .from("user_follows")
        .select("following_id, following:profiles!user_follows_following_id_fkey (display_name)")
        .eq("follower_id", user.id);

      if (error) {
        console.error("Error fetching followed users:", error);
        throw error;
      }

      console.log('Followed users data:', follows);

      return follows?.map(f => f.following_id) || [];
    }
  });
}