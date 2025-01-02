import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPredictionsDialog } from "./UserPredictionsDialog";
import { FollowedUserCard } from "./following/FollowedUserCard";
import { EmptyFollowingState } from "./following/EmptyFollowingState";

export function FollowedUsersList() {
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    display_name: string;
  } | null>(null);

  const { data: followedUsers, isLoading } = useQuery({
    queryKey: ["followed-users"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_follows")
        .select(`
          following_id,
          following:profiles!user_follows_following_id_fkey (
            id,
            display_name,
            total_points,
            points_per_game
          )
        `)
        .eq("follower_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!followedUsers?.length) {
    return <EmptyFollowingState />;
  }

  return (
    <>
      <div className="space-y-4">
        {followedUsers.map((follow) => (
          <FollowedUserCard
            key={follow.following_id}
            user={follow.following}
            onUserClick={setSelectedUser}
          />
        ))}
      </div>

      {selectedUser && (
        <UserPredictionsDialog
          isOpen={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
          userId={selectedUser.id}
          userName={selectedUser.display_name}
        />
      )}
    </>
  );
}