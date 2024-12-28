import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { FollowButton } from "@/components/users/FollowButton";
import { useFollowStatus } from "@/hooks/useFollowStatus";
import { useEffect } from "react";

export function AllTimeLeaderboard() {
  const { data: rankings, isLoading, refetch } = useQuery({
    queryKey: ["leaderboard", "all-time"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          display_name,
          total_points,
          points_per_game,
          total_predictions,
          user_follows!user_follows_following_id_fkey(follower_id)
        `)
        .order("total_points", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  // Subscribe to real-time updates for follows
  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-follows')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_follows'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Award className="h-5 w-5 text-primary/20" />;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="text-right">PPG</TableHead>
            <TableHead className="text-right">Predictions</TableHead>
            <TableHead className="w-28"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankings?.map((player, index) => (
            <LeaderboardRow
              key={player.id}
              player={player}
              rank={index + 1}
              getRankIcon={getRankIcon}
              onFollowChange={refetch}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function LeaderboardRow({ player, rank, getRankIcon, onFollowChange }) {
  const { isFollowing, currentUser } = useFollowStatus(player.id);

  // Don't show follow button for the current user
  const showFollowButton = currentUser && currentUser.id !== player.id;

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {getRankIcon(rank)}
          {rank}
        </div>
      </TableCell>
      <TableCell>{player.display_name}</TableCell>
      <TableCell className="text-right">{player.total_points}</TableCell>
      <TableCell className="text-right">
        {player.points_per_game?.toFixed(1)}
      </TableCell>
      <TableCell className="text-right">
        {player.total_predictions}
      </TableCell>
      <TableCell className="text-right">
        {showFollowButton && (
          <FollowButton
            userId={player.id}
            isFollowing={isFollowing}
            onFollowChange={onFollowChange}
          />
        )}
      </TableCell>
    </TableRow>
  );
}