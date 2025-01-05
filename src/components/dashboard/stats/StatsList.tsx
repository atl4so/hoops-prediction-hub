import { Trophy, Target, TrendingUp, ArrowUp, Crown, Medal, Home } from "lucide-react";
import { StatsGrid } from "./StatsGrid";
import { useState } from "react";
import { WinnerPredictionsDialog } from "./WinnerPredictionsDialog";
import { HomeAwayPredictionsDialog } from "./HomeAwayPredictionsDialog";

interface StatsListProps {
  totalPoints: number;
  pointsPerGame: number;
  totalPredictions: number;
  highestGamePoints?: number | null;
  allTimeRank?: number | null;
  currentRoundRank?: { rank: number | null; isCurrent: boolean; roundName: string };
  winnerPredictionsCorrect?: number;
  winnerPredictionsTotal?: number;
  homeWinnerPredictionsCorrect?: number;
  homeWinnerPredictionsTotal?: number;
  awayWinnerPredictionsCorrect?: number;
  awayWinnerPredictionsTotal?: number;
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
  homeWinnerPredictionsCorrect = 0,
  homeWinnerPredictionsTotal = 0,
  awayWinnerPredictionsCorrect = 0,
  awayWinnerPredictionsTotal = 0,
  userId,
}: StatsListProps) {
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [showHomeAwayDialog, setShowHomeAwayDialog] = useState(false);

  // Calculate percentages safely
  const winnerPercentage = winnerPredictionsTotal > 0
    ? Math.round((winnerPredictionsCorrect / winnerPredictionsTotal) * 100)
    : 0;

  const homeWinnerPercentage = homeWinnerPredictionsTotal > 0
    ? Math.round((homeWinnerPredictionsCorrect / homeWinnerPredictionsTotal) * 100)
    : 0;

  const awayWinnerPercentage = awayWinnerPredictionsTotal > 0
    ? Math.round((awayWinnerPredictionsCorrect / awayWinnerPredictionsTotal) * 100)
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
      icon: Target,
      label: "Winner Prediction %",
      value: `${winnerPercentage}%`,
      description: `Correctly predicted ${winnerPredictionsCorrect} winners out of ${winnerPredictionsTotal} games`,
      onClick: userId ? () => setShowWinnerDialog(true) : undefined
    },
    {
      icon: Home,
      label: "Home/Away Winner %",
      value: `${homeWinnerPercentage}% / ${awayWinnerPercentage}%`,
      description: `Home: ${homeWinnerPredictionsCorrect}/${homeWinnerPredictionsTotal} | Away: ${awayWinnerPredictionsCorrect}/${awayWinnerPredictionsTotal}`,
      onClick: userId ? () => setShowHomeAwayDialog(true) : undefined
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
          <HomeAwayPredictionsDialog
            isOpen={showHomeAwayDialog}
            onOpenChange={setShowHomeAwayDialog}
            userId={userId}
          />
        </>
      )}
    </>
  );
}