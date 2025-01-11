import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RankDisplay } from "./components/RankDisplay";
import { PlayerInfo } from "./components/PlayerInfo";
import { StatsDisplay } from "./components/StatsDisplay";
import { PlayerDetailsDialog } from "./components/PlayerDetailsDialog";

interface LeaderboardRowProps {
  player: {
    user_id?: string;
    display_name: string;
    total_points: number;
    points_per_game?: number;
    total_predictions: number;
    avatar_url?: string;
    home_winner_predictions_correct?: number;
    home_winner_predictions_total?: number;
    away_winner_predictions_correct?: number;
    away_winner_predictions_total?: number;
    winner_predictions_correct?: number;
    winner_predictions_total?: number;
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

  const calculatePercentage = (correct?: number, total?: number) => {
    if (!correct || !total) return 0;
    return Math.round((correct / total) * 100);
  };

  const homeWinPercentage = calculatePercentage(player.home_winner_predictions_correct, player.home_winner_predictions_total);
  const awayWinPercentage = calculatePercentage(player.away_winner_predictions_correct, player.away_winner_predictions_total);
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
        <TableCell className="font-medium py-4 px-4">
          <RankDisplay rank={rank} />
        </TableCell>

        <TableCell className="py-4">
          <PlayerInfo 
            displayName={player.display_name}
            avatarUrl={player.avatar_url}
          />
        </TableCell>

        <TableCell className="text-right py-4 px-4">
          <div className="space-y-1">
            <span className="font-bold text-base">{player.total_points}</span>
            {isMobile && winnerPercentage > 0 && (
              <p className="text-xs text-muted-foreground">
                Winner: {winnerPercentage}%
              </p>
            )}
          </div>
        </TableCell>

        <StatsDisplay
          winnerPercentage={winnerPercentage}
          homeWinPercentage={homeWinPercentage}
          awayWinPercentage={awayWinPercentage}
          homeTotalStats={`Home: ${player.home_winner_predictions_correct} of ${player.home_winner_predictions_total}`}
          awayTotalStats={`Away: ${player.away_winner_predictions_correct} of ${player.away_winner_predictions_total}`}
          winnerStats={`${player.winner_predictions_correct} correct out of ${player.winner_predictions_total}`}
          isRoundLeaderboard={isRoundLeaderboard}
        />

        <TableCell className="text-right py-4 px-4">
          <span className="font-semibold text-base">{player.total_predictions}</span>
        </TableCell>
      </motion.tr>

      <PlayerDetailsDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        player={player}
        rank={rank}
        isRoundLeaderboard={isRoundLeaderboard}
      />
    </>
  );
}