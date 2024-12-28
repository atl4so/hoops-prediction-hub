import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { FollowButton } from "@/components/users/FollowButton";
import { Skeleton } from "@/components/ui/skeleton";

export function FollowedUsersList() {
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
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!followedUsers?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            You are not following anyone yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {followedUsers.map((follow) => (
        <Card key={follow.following_id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{follow.following.display_name}</p>
                <div className="text-sm text-muted-foreground">
                  <p>Total Points: {follow.following.total_points}</p>
                  <p>PPG: {follow.following.points_per_game?.toFixed(1)}</p>
                </div>
              </div>
              <FollowButton
                userId={follow.following_id}
                isFollowing={true}
                onFollowChange={() => {}}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}