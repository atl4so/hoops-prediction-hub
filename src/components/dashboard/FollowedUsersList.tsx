import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPredictionsDialog } from "./UserPredictionsDialog";
import { FollowedUserCard } from "./following/FollowedUserCard";
import { EmptyFollowingState } from "./following/EmptyFollowingState";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

interface FollowedUsersListProps {
  searchQuery: string;
}

export function FollowedUsersList({ searchQuery }: FollowedUsersListProps) {
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    display_name: string;
  } | null>(null);
  const isMobile = useIsMobile();

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
            points_per_game,
            winner_predictions_correct,
            winner_predictions_total,
            home_winner_predictions_correct,
            home_winner_predictions_total,
            away_winner_predictions_correct,
            away_winner_predictions_total
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
              points_per_game,
              winner_predictions_correct,
              winner_predictions_total,
              home_winner_predictions_correct,
              home_winner_predictions_total,
              away_winner_predictions_correct,
              away_winner_predictions_total
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
      <div className="space-y-3 sm:space-y-4 animate-pulse">
        <div className="h-20 sm:h-24 w-full bg-muted rounded-lg" />
        <div className="h-20 sm:h-24 w-full bg-muted rounded-lg" />
        <div className="h-20 sm:h-24 w-full bg-muted rounded-lg" />
      </div>
    );
  }

  if (!followedUsers?.length && !searchQuery) {
    return <EmptyFollowingState />;
  }

  if (!followedUsers?.length && searchQuery) {
    return (
      <div className="text-center text-muted-foreground py-6 sm:py-8 animate-fade-in">
        No users found matching "{searchQuery}"
      </div>
    );
  }

  return (
    <>
      {isMobile && (
        <div className="mb-4 sm:mb-6 animate-fade-in">
          <Alert variant="default" className="bg-background/50 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Tap on a username to view their predictions
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
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