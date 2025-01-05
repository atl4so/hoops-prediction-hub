import { Trophy, Target, TrendingUp, ArrowUp, Crown, Medal, Percent, Scale } from "lucide-react";
import { StatsGrid } from "./StatsGrid";
import { useState } from "react";
import { WinnerPredictionsDialog } from "./WinnerPredictionsDialog";

interface StatsListProps {
  totalPoints: number;
  pointsPerGame: number;
  totalPredictions: number;
  highestGamePoints?: number | null;
  lowestGamePoints?: number | null;
  highestRoundPoints?: number | null;
  lowestRoundPoints?: number | null;
  allTimeRank?: number | null;
  currentRoundRank?: { rank: number | null; isCurrent: boolean; roundName: string };
  winnerPredictionsCorrect?: number;
  winnerPredictionsTotal?: number;
  overUnderPredictionsCorrect?: number;
  overUnderPredictionsTotal?: number;
  userId?: string;
}

const formatRank = (rank: number | null | undefined) => {
  if (!rank) return "-";
  const suffix = ["th", "st", "nd", "rd"];
  const v = rank % 100;
  return rank + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
};

export function StatsList({
  totalPoints,
  pointsPerGame,
  totalPredictions,
  highestGamePoints,
  allTimeRank,
  currentRoundRank,
  winnerPredictionsCorrect = 0,
  winnerPredictionsTotal = 0,
  overUnderPredictionsCorrect = 0,
  overUnderPredictionsTotal = 0,
  userId,
}: StatsListProps) {
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);

  const winnerPercentage = winnerPredictionsTotal > 0
    ? Math.round((winnerPredictionsCorrect / winnerPredictionsTotal) * 100)
    : 0;

  const overUnderPercentage = overUnderPredictionsTotal > 0
    ? Math.round((overUnderPredictionsCorrect / overUnderPredictionsTotal) * 100)
    : 0;

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
      icon: Percent,
      label: "Winner Prediction %",
      value: `${winnerPercentage}%`,
      description: `Correctly predicted ${winnerPredictionsCorrect} winners out of ${winnerPredictionsTotal} games`,
      onClick: userId ? () => setShowWinnerDialog(true) : undefined
    },
    {
      icon: Scale,
      label: "Over/Under %",
      value: `${overUnderPercentage}%`,
      description: `Correctly predicted ${overUnderPredictionsCorrect} over/under out of ${overUnderPredictionsTotal} games`,
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
      label: "Highest Game Points",
      value: highestGamePoints || 0,
      description: "Best performance in a single game"
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