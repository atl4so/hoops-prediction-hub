import { Trophy, Target, TrendingUp, ArrowUp, Crown, Medal } from "lucide-react";
import { StatsGrid } from "./StatsGrid";
import { useState } from "react";
import { WinnerPredictionsDialog } from "./WinnerPredictionsDialog";

interface StatsListProps {
  totalPoints: number;
  pointsPerGame: number;
  totalPredictions: number;
  highestGamePoints?: number | null;
  highestRoundPoints?: number | null;
  allTimeRank?: number | null;
  currentRoundRank?: { rank: number | null; isCurrent: boolean; roundName: string };
  winnerPredictionsCorrect?: number;
  winnerPredictionsTotal?: number;
  userId?: string;
}

const formatRank = (rank: number | null | undefined) => {
  if (!rank) return "-";
  const suffix = ["th", "st", "nd", "rd"];
  const v = rank % 100;
  return rank + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
};

const calculatePercentage = (correct: number = 0, total: number = 0): number => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

export function StatsList({
  totalPoints,
  pointsPerGame,
  totalPredictions,
  highestGamePoints,
  highestRoundPoints,
  allTimeRank,
  currentRoundRank,
  winnerPredictionsCorrect = 0,
  winnerPredictionsTotal = 0,
  userId,
}: StatsListProps) {
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);

  const winnerPercentage = calculatePercentage(winnerPredictionsCorrect, winnerPredictionsTotal);

  const stats = [
    {
      icon: Trophy,
      label: "Total Points",
      value: totalPoints || 0,
      description: "Your cumulative points from all predictions",
    },
    {
      icon: Crown,
      label: "All-Time Rank",
      value: formatRank(allTimeRank),
      description: "Your overall ranking among all players",
    },
    {
      icon: Medal,
      label: "Latest Round Rank",
      value: formatRank(currentRoundRank?.rank),
      description: `Your position in Round ${currentRoundRank?.roundName} leaderboard`,
    },
    {
      icon: Target,
      label: "Winner Prediction",
      value: `${winnerPercentage}%`,
      description: `Correctly predicted ${winnerPredictionsCorrect} winners out of ${winnerPredictionsTotal} games`,
      onClick: userId ? () => setShowWinnerDialog(true) : undefined
    },
    {
      icon: Target,
      label: "Points per Game",
      value: (pointsPerGame || 0).toFixed(1),
      description: "Average points earned per prediction"
    },
    {
      icon: TrendingUp,
      label: "Total Predictions",
      value: totalPredictions || 0,
      description: "Number of predictions you've made"
    },
    {
      icon: ArrowUp,
      label: "Best Game",
      value: highestGamePoints || 0,
      description: "Best performance in a single game"
    },
    {
      icon: ArrowUp,
      label: "Best Round",
      value: highestRoundPoints || 0,
      description: "Best performance in a single round"
    }
  ];

  return (
    <>
      <StatsGrid stats={stats} />
      {userId && (
        <WinnerPredictionsDialog
          isOpen={showWinnerDialog}
          onOpenChange={setShowWinnerDialog}
          userId={userId}
        />
      )}
    </>
  );
}