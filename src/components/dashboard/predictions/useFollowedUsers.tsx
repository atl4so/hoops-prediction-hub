import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFollowedUsers() {
  return useQuery({
    queryKey: ["followed-users"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: follows, error } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", user.id);

      if (error) {
        console.error("Error fetching followed users:", error);
        throw error;
      }

      return follows?.map(f => f.following_id) || [];
    }
  });
}