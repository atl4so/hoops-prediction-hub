import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPredictionsDialog } from "./UserPredictionsDialog";
import { FollowedUserCard } from "./following/FollowedUserCard";
import { EmptyFollowingState } from "./following/EmptyFollowingState";

interface FollowedUsersListProps {
  searchQuery: string;
}

export function FollowedUsersList({ searchQuery }: FollowedUsersListProps) {
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    display_name: string;
  } | null>(null);

  const { data: followedUsers, isLoading, refetch } = useQuery({
    queryKey: ["followed-users", searchQuery],
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
            avatar_url,
            total_points,
            points_per_game
          )
        `)
        .eq("follower_id", user.id);

      if (error) throw error;

      // Filter users based on search query
      const filteredData = searchQuery
        ? data.filter(follow => 
            follow.following.display_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : data;

      return filteredData;
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

  if (!followedUsers?.length && !searchQuery) {
    return <EmptyFollowingState />;
  }

  if (!followedUsers?.length && searchQuery) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No users found matching "{searchQuery}"
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {followedUsers.map((follow) => (
          <FollowedUserCard
            key={follow.following_id}
            user={follow.following}
            onUserClick={setSelectedUser}
            onFollowChange={refetch}
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