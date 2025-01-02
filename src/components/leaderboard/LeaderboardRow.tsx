import { Trophy, Medal, Award, User } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { FollowButton } from "@/components/users/FollowButton";
import { useFollowStatus } from "@/hooks/useFollowStatus";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardRowProps {
  player: {
    id?: string;
    user_id?: string;
    display_name: string;
    total_points: number;
    points_per_game?: number;
    total_predictions?: number;
    predictions_count?: number;
    avatar_url?: string;
  };
  rank: number;
  onFollowChange?: () => void;
  isRoundLeaderboard?: boolean;
  showFollowButton?: boolean;
}

export function LeaderboardRow({ 
  player, 
  rank, 
  onFollowChange, 
  isRoundLeaderboard = false,
  showFollowButton = true 
}: LeaderboardRowProps) {
  const [showDetails, setShowDetails] = useState(false);
  const userId = player.id || player.user_id;
  const { isFollowing, currentUser, isLoading } = useFollowStatus(userId);
  const isMobile = useIsMobile();

  const showFollowButtonFinal = !isLoading && currentUser && currentUser.id !== userId && showFollowButton && isFollowing;

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

  const handleUserClick = () => {
    if (isMobile) {
      setShowDetails(true);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            {getRankIcon(rank)}
            {rank}
          </div>
        </TableCell>
        <TableCell>
          <div 
            className={cn(
              "flex items-center gap-2",
              isMobile && "cursor-pointer hover:text-primary transition-colors"
            )}
            onClick={handleUserClick}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={player.avatar_url} alt={player.display_name} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            {player.display_name}
          </div>
        </TableCell>
        <TableCell className="text-right">{player.total_points}</TableCell>
        {!isMobile && !isRoundLeaderboard && (
          <>
            <TableCell className="text-right">
              {player.points_per_game?.toFixed(1) || "0.0"}
            </TableCell>
            <TableCell className="text-right">
              {player.total_predictions || player.predictions_count || 0}
            </TableCell>
          </>
        )}
        {showFollowButtonFinal && (
          <TableCell className="text-right">
            <FollowButton
              userId={userId}
              isFollowing={isFollowing}
              onFollowChange={onFollowChange}
            />
          </TableCell>
        )}
      </TableRow>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={player.avatar_url} alt={player.display_name} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                {player.display_name}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className={cn("grid gap-4", !isRoundLeaderboard ? "grid-cols-2" : "grid-cols-1")}>
              {!isRoundLeaderboard && (
                <div>
                  <p className="text-sm text-muted-foreground">Points Per Game</p>
                  <p className="text-lg font-medium">
                    {player.points_per_game?.toFixed(1) || "0.0"}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Total Predictions</p>
                <p className="text-lg font-medium">
                  {player.total_predictions || player.predictions_count || 0}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}