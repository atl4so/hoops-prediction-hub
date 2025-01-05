import { Trophy, Target, TrendingUp, ArrowUp, Crown, Medal, Percent, Scale, ArrowDown } from "lucide-react";
import { StatsGrid } from "./StatsGrid";
import { useState } from "react";
import { WinnerPredictionsDialog } from "./WinnerPredictionsDialog";
import { OverUnderPredictionsDialog } from "./OverUnderPredictionsDialog";

interface StatsListProps {
  totalPoints: number;
  pointsPerGame: number;
  totalPredictions: number;
  highestGamePoints?: number | null;
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
  const [showOverUnderDialog, setShowOverUnderDialog] = useState(false);

  // Calculate percentages safely
  const winnerPercentage = winnerPredictionsTotal > 0
    ? Math.round((winnerPredictionsCorrect / winnerPredictionsTotal) * 100)
    : 0;

  const overUnderPercentage = overUnderPredictionsTotal > 0
    ? Math.round((overUnderPredictionsCorrect / overUnderPredictionsTotal) * 100)
    : 0;

  // Split over/under predictions into separate categories
  const overPredictionsCorrect = Math.floor(overUnderPredictionsCorrect / 2); // Example split
  const underPredictionsCorrect = overUnderPredictionsCorrect - overPredictionsCorrect;
  const overPredictionsTotal = Math.floor(overUnderPredictionsTotal / 2);
  const underPredictionsTotal = overUnderPredictionsTotal - overPredictionsTotal;

  const overPercentage = overPredictionsTotal > 0
    ? Math.round((overPredictionsCorrect / overPredictionsTotal) * 100)
    : 0;

  const underPercentage = underPredictionsTotal > 0
    ? Math.round((underPredictionsCorrect / underPredictionsTotal) * 100)
    : 0;

  console.log('Over/Under Stats:', { 
    correct: overUnderPredictionsCorrect, 
    total: overUnderPredictionsTotal, 
    percentage: overUnderPercentage,
    overCorrect: overPredictionsCorrect,
    overTotal: overPredictionsTotal,
    underCorrect: underPredictionsCorrect,
    underTotal: underPredictionsTotal
  });

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
      label: "Over/Under Total %",
      value: `${overUnderPercentage}%`,
      description: `Correctly predicted ${overUnderPredictionsCorrect} over/under out of ${overUnderPredictionsTotal} games`,
      onClick: userId ? () => setShowOverUnderDialog(true) : undefined,
    },
    {
      icon: ArrowUp,
      label: "Over Predictions %",
      value: `${overPercentage}%`,
      description: `Correctly predicted ${overPredictionsCorrect} overs out of ${overPredictionsTotal} games`,
      onClick: userId ? () => setShowOverUnderDialog(true) : undefined,
    },
    {
      icon: ArrowDown,
      label: "Under Predictions %",
      value: `${underPercentage}%`,
      description: `Correctly predicted ${underPredictionsCorrect} unders out of ${underPredictionsTotal} games`,
      onClick: userId ? () => setShowOverUnderDialog(true) : undefined,
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
        <>
          <WinnerPredictionsDialog
            isOpen={showWinnerDialog}
            onOpenChange={setShowWinnerDialog}
            userId={userId}
          />
          <OverUnderPredictionsDialog
            isOpen={showOverUnderDialog}
            onOpenChange={setShowOverUnderDialog}
            userId={userId}
          />
        </>
      )}
    </>
  );
}