import { Trophy, Medal, Award } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { FollowButton } from "@/components/users/FollowButton";
import { useFollowStatus } from "@/hooks/useFollowStatus";

interface LeaderboardRowProps {
  player: {
    id?: string;
    user_id?: string;
    display_name: string;
    total_points: number;
    points_per_game?: number;
    total_predictions?: number;
    predictions_count?: number;
  };
  rank: number;
  onFollowChange: () => void;
}

export function LeaderboardRow({ player, rank, onFollowChange }: LeaderboardRowProps) {
  const userId = player.id || player.user_id;
  const { isFollowing, currentUser, isLoading } = useFollowStatus(userId);

  // Don't show follow button for the current user, if already following, or while loading
  const showFollowButton = !isLoading && currentUser && currentUser.id !== userId && !isFollowing;

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
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {getRankIcon(rank)}
          {rank}
        </div>
      </TableCell>
      <TableCell>{player.display_name}</TableCell>
      <TableCell className="text-right">{player.total_points}</TableCell>
      {player.points_per_game !== undefined && (
        <TableCell className="text-right">
          {player.points_per_game?.toFixed(1)}
        </TableCell>
      )}
      <TableCell className="text-right">
        {player.total_predictions || player.predictions_count}
      </TableCell>
      <TableCell className="text-right">
        {showFollowButton && (
          <FollowButton
            userId={userId}
            isFollowing={isFollowing}
            onFollowChange={onFollowChange}
          />
        )}
      </TableCell>
    </TableRow>
  );
}