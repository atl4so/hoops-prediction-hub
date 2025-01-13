import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RankDisplay } from "./RankDisplay";
import { PlayerInfo } from "./PlayerInfo";
import { PlayerDetailsDialog } from "./PlayerDetailsDialog";
import { StatCell } from "./StatCell";

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

  const winnerPercentage = calculatePercentage(
    player.winner_predictions_correct, 
    player.winner_predictions_total
  );

  const handleUserClick = () => {
    setShowDetails(true);
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
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
        <TableCell className="w-24">
          <RankDisplay rank={rank} />
        </TableCell>

        <TableCell className="w-56">
          <PlayerInfo 
            displayName={player.display_name}
            avatarUrl={player.avatar_url}
          />
        </TableCell>

        <StatCell value={player.total_points} />
        <StatCell value={player.ppg?.toFixed(1) || '0.0'} />
        <StatCell value={player.efficiency?.toFixed(1) || '0.0'} />
        <StatCell value={player.underdog_picks || 0} />
        <StatCell value={winnerPercentage} suffix="%" />
        <StatCell value={player.total_predictions} />
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