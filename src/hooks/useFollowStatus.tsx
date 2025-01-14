import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFollowStatus(targetUserId: string) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_follows")
          .select()
          .eq("follower_id", currentUser.id)
          .eq("following_id", targetUserId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error("Error checking follow status:", error);
        }

        setIsFollowing(!!data);
      } catch (error) {
        console.error("Error in checkFollowStatus:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFollowStatus();
  }, [currentUser, targetUserId]);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!currentUser) return;

    const channelName = `follow-status-${currentUser.id}-${targetUserId}`;
    console.log('Subscribing to channel:', channelName);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_follows',
          filter: `follower_id=eq.${currentUser.id}&following_id=eq.${targetUserId}`,
        },
        (payload) => {
          console.log('Received payload:', payload);
          if (payload.eventType === "INSERT") {
            setIsFollowing(true);
          } else if (payload.eventType === "DELETE") {
            setIsFollowing(false);
          }
        }
      )
      .subscribe((status) => {
        console.log('Channel status:', status);
      });

    return () => {
      console.log('Cleaning up channel:', channelName);
      supabase.removeChannel(channel);
    };
  }, [currentUser, targetUserId]);

  return { isFollowing, currentUser, isLoading };
}