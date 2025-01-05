import { Trophy, Target, TrendingUp, ArrowUp, Crown, Medal, Home, Plane } from "lucide-react";
import { StatsGrid } from "./StatsGrid";
import { useState } from "react";
import { WinnerPredictionsDialog } from "./WinnerPredictionsDialog";
import { HomeAwayPredictionsDialog } from "./HomeAwayPredictionsDialog";
import { cn } from "@/lib/utils";

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
  highestRoundPoints,
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
      value: `${winnerPredictionsTotal > 0 ? Math.round((winnerPredictionsCorrect / winnerPredictionsTotal) * 100) : 0}%`,
      description: `Correctly predicted ${winnerPredictionsCorrect} winners out of ${winnerPredictionsTotal} games`,
      onClick: userId ? () => setShowWinnerDialog(true) : undefined
    },
    {
      icon: Home,
      label: "Home/Away",
      value: (
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span>{homeWinnerPredictionsTotal > 0 ? Math.round((homeWinnerPredictionsCorrect / homeWinnerPredictionsTotal) * 100) : 0}</span>
          </div>
          <span>/</span>
          <div className="flex items-center gap-1">
            <Plane className="h-4 w-4" />
            <span>{awayWinnerPredictionsTotal > 0 ? Math.round((awayWinnerPredictionsCorrect / awayWinnerPredictionsTotal) * 100) : 0}</span>
          </div>
        </div>
      ),
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