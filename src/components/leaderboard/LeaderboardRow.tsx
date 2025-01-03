import { Trophy, Medal, Award, User, Star } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface LeaderboardRowProps {
  player: {
    user_id?: string;
    display_name: string;
    total_points: number;
    points_per_game?: number;
    total_predictions: number;
    avatar_url?: string;
  };
  rank: number;
  isRoundLeaderboard?: boolean;
  showFollowButton?: boolean;
  index: number;
}

export function LeaderboardRow({ 
  player, 
  rank, 
  isRoundLeaderboard = false,
  showFollowButton = true,
  index
}: LeaderboardRowProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isMobile = useIsMobile();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Medal className="h-4 w-4 text-amber-600" />;
      default:
        return rank <= 10 ? <Star className="h-4 w-4 text-primary/40" /> : null;
    }
  };

  const handleUserClick = () => {
    if (isMobile) {
      setShowDetails(true);
    }
  };

  const rowVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.05
      }
    }
  };

  return (
    <>
      <motion.tr
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "group cursor-pointer transition-colors hover:bg-accent/50",
          rank <= 3 ? "bg-accent/20" : ""
        )}
        onClick={handleUserClick}
      >
        <TableCell className="font-medium py-2 px-2">
          <div className="flex items-center gap-1">
            {getRankIcon(rank)}
            <span className={cn(
              "font-semibold text-sm",
              rank === 1 ? "text-yellow-500" :
              rank === 2 ? "text-gray-400" :
              rank === 3 ? "text-amber-600" :
              rank <= 10 ? "text-primary/70" : ""
            )}>
              #{rank}
            </span>
          </div>
        </TableCell>

        <TableCell className="py-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={player.avatar_url} />
              <AvatarFallback>
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{player.display_name}</span>
          </div>
        </TableCell>

        <TableCell className="text-right py-2 px-2">
          <span className="font-semibold text-sm">{player.total_points}</span>
        </TableCell>

        {!isRoundLeaderboard && (
          <TableCell className="text-right py-2 px-2 hidden sm:table-cell">
            <span className="font-medium text-sm">{player.points_per_game?.toFixed(1)}</span>
          </TableCell>
        )}

        <TableCell className="text-right py-2 px-2">
          <span className="font-medium text-sm">{player.total_predictions}</span>
        </TableCell>
      </motion.tr>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Player Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={player.avatar_url} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-base font-semibold">{player.display_name}</h3>
                <p className="text-sm text-muted-foreground">Rank #{rank}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-xl font-bold">{player.total_points}</p>
              </div>
              {!isRoundLeaderboard && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">PPG</p>
                  <p className="text-xl font-bold">{player.points_per_game?.toFixed(1)}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Predictions</p>
                <p className="text-xl font-bold">{player.total_predictions}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}