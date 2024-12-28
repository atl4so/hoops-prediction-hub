import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFollowStatus(targetUserId: string) {
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Check initial follow status
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser) return;

      const { data, error } = await supabase
        .from("user_follows")
        .select()
        .eq("follower_id", currentUser.id)
        .eq("following_id", targetUserId)
        .maybeSingle();

      if (error) {
        console.error("Error checking follow status:", error);
        return;
      }

      setIsFollowing(!!data);
    };

    checkFollowStatus();
  }, [currentUser, targetUserId]);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel('follow-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_follows',
          filter: `follower_id=eq.${currentUser.id}&following_id=eq.${targetUserId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setIsFollowing(true);
          } else if (payload.eventType === "DELETE") {
            setIsFollowing(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, targetUserId]);

  return { isFollowing, currentUser };
}