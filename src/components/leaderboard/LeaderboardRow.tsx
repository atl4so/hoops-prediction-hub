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
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return rank <= 10 ? <Star className="h-5 w-5 text-primary/40" /> : null;
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
          rank <= 3 ? "bg-accent/20" : "",
          rank === 1 ? "bg-yellow-500/10" : "",
          rank === 2 ? "bg-gray-400/10" : "",
          rank === 3 ? "bg-amber-600/10" : ""
        )}
        onClick={handleUserClick}
      >
        <TableCell className="font-medium py-4 px-4">
          <div className="flex items-center gap-2">
            {getRankIcon(rank)}
            <span className={cn(
              "font-bold text-base",
              rank === 1 ? "text-yellow-500" :
              rank === 2 ? "text-gray-400" :
              rank === 3 ? "text-amber-600" :
              rank <= 10 ? "text-primary/70" : ""
            )}>
              {rank}
            </span>
          </div>
        </TableCell>

        <TableCell className="py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={player.avatar_url} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-base">{player.display_name}</span>
          </div>
        </TableCell>

        <TableCell className="text-right py-4 px-4">
          <span className="font-bold text-base">{player.total_points}</span>
        </TableCell>

        {!isRoundLeaderboard && (
          <TableCell className="text-right py-4 px-4 hidden sm:table-cell">
            <span className="font-semibold text-base">{player.points_per_game?.toFixed(1)}</span>
          </TableCell>
        )}

        <TableCell className="text-right py-4 px-4">
          <span className="font-semibold text-base">{player.total_predictions}</span>
        </TableCell>
      </motion.tr>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Player Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={player.avatar_url} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold">{player.display_name}</h3>
                <p className="text-sm text-muted-foreground">Rank {rank}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{player.total_points}</p>
              </div>
              {!isRoundLeaderboard && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">PPG</p>
                  <p className="text-2xl font-bold">{player.points_per_game?.toFixed(1)}</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Predictions</p>
                <p className="text-2xl font-bold">{player.total_predictions}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}