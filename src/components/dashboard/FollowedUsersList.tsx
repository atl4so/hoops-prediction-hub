import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPredictionsDialog } from "./UserPredictionsDialog";
import { FollowedUserCard } from "./following/FollowedUserCard";
import { EmptyFollowingState } from "./following/EmptyFollowingState";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

      if (searchQuery) {
        // Search all users when there's a search query
        const { data: searchResults, error: searchError } = await supabase
          .from("profiles")
          .select(`
            id,
            display_name,
            avatar_url,
            total_points,
            points_per_game
          `)
          .ilike('display_name', `%${searchQuery}%`)
          .neq('id', user.id); // Exclude current user

        if (searchError) throw searchError;

        // Check which users are being followed
        const { data: followedData } = await supabase
          .from("user_follows")
          .select("following_id")
          .eq("follower_id", user.id);

        const followedIds = new Set(followedData?.map(f => f.following_id) || []);

        return searchResults.map(profile => ({
          following_id: profile.id,
          following: {
            ...profile,
            isFollowed: followedIds.has(profile.id)
          }
        }));
      } else {
        // Only show followed users when there's no search
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

        return data.map(item => ({
          ...item,
          following: {
            ...item.following,
            isFollowed: true
          }
        }));
      }
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
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Click on a username to view their predictions
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {followedUsers.map((follow) => (
          <FollowedUserCard
            key={follow.following_id}
            user={{
              ...follow.following,
              total_points: follow.following.total_points || 0,
              points_per_game: follow.following.points_per_game || 0
            }}
            onUserClick={setSelectedUser}
            onFollowChange={refetch}
            isFollowing={follow.following.isFollowed}
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