import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RankDisplay } from "./components/RankDisplay";
import { PlayerInfo } from "./components/PlayerInfo";
import { PlayerDetailsDialog } from "./components/PlayerDetailsDialog";

interface LeaderboardRowProps {
  player: {
    user_id?: string;
    display_name: string;
    total_points: number;
    points_per_game?: number;
    total_predictions: number;
    avatar_url?: string;
    winner_predictions_correct?: number;
    winner_predictions_total?: number;
    ppg?: number;
    efficiency?: number;
    underdog_picks?: number;
  };
  rank: number;
  isRoundLeaderboard?: boolean;
  showFollowButton?: boolean;
  index: number;
  roundId?: string;
}

export function LeaderboardRow({ 
  player, 
  rank, 
  isRoundLeaderboard = false,
  showFollowButton = true,
  index,
  roundId
}: LeaderboardRowProps) {
  const [showDetails, setShowDetails] = useState(false);

  const calculatePercentage = (correct?: number, total?: number) => {
    if (!correct || !total) return 0;
    return Math.round((correct / total) * 100);
  };

  const winnerPercentage = calculatePercentage(player.winner_predictions_correct, player.winner_predictions_total);

  const handleUserClick = () => {
    setShowDetails(true);
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
        <TableCell className="w-20 font-medium">
          <RankDisplay rank={rank} />
        </TableCell>

        <TableCell className="w-48">
          <PlayerInfo 
            displayName={player.display_name}
            avatarUrl={player.avatar_url}
          />
        </TableCell>

        <TableCell className="w-28 text-right">
          <span className="font-bold text-base">{player.total_points}</span>
        </TableCell>

        <TableCell className="w-28 text-right">
          <span className="font-semibold text-base">{player.ppg?.toFixed(1) || '0.0'}</span>
        </TableCell>

        <TableCell className="w-28 text-right">
          <span className="font-semibold text-base">{player.efficiency?.toFixed(1) || '0.0'}</span>
        </TableCell>

        <TableCell className="w-28 text-right">
          <span className="font-semibold text-base">{player.underdog_picks || 0}</span>
        </TableCell>

        <TableCell className="w-28 text-right">
          <span className="font-semibold text-base">{winnerPercentage}%</span>
        </TableCell>

        <TableCell className="w-24 text-right">
          <span className="font-semibold text-base">{player.total_predictions}</span>
        </TableCell>
      </motion.tr>

      <PlayerDetailsDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        player={player}
        rank={rank}
        isRoundLeaderboard={isRoundLeaderboard}
        roundId={roundId}
      />
    </>
  );
}