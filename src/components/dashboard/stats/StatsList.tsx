import { useState } from "react";
import { StatCard } from "./StatCard";
import { ArrowUp, Home, Target, Trophy } from "lucide-react";
import { WinnerPredictionsDialog } from "./WinnerPredictionsDialog";
import { HomeAwayPredictionsDialog } from "./HomeAwayPredictionsDialog";
import { OverUnderPredictionsDialog } from "./OverUnderPredictionsDialog";

interface StatsListProps {
  userId?: string;
  totalPoints: number;
  pointsPerGame: number;
  totalPredictions: number;
  highestGamePoints?: number;
  allTimeRank?: number;
  currentRoundRank?: number;
  winnerPredictionsCorrect?: number;
  winnerPredictionsTotal?: number;
  overUnderPredictionsCorrect?: number;
  overUnderPredictionsTotal?: number;
}

export function StatsList({
  userId,
  totalPoints,
  pointsPerGame,
  totalPredictions,
  highestGamePoints = 0,
  allTimeRank,
  currentRoundRank,
  winnerPredictionsCorrect = 0,
  winnerPredictionsTotal = 0,
  overUnderPredictionsCorrect = 0,
  overUnderPredictionsTotal = 0,
}: StatsListProps) {
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [showHomeAwayDialog, setShowHomeAwayDialog] = useState(false);
  const [showOverUnderDialog, setShowOverUnderDialog] = useState(false);

  // Calculate home/away percentages from winner predictions
  const homeWinnerPredictionsCorrect = winnerPredictionsCorrect || 0;
  const homeWinnerPredictionsTotal = winnerPredictionsTotal || 0;
  const homeWinnerPercentage = homeWinnerPredictionsTotal > 0 
    ? Math.round((homeWinnerPredictionsCorrect / homeWinnerPredictionsTotal) * 100) 
    : 0;

  const awayWinnerPredictionsCorrect = overUnderPredictionsCorrect || 0;
  const awayWinnerPredictionsTotal = overUnderPredictionsTotal || 0;
  const awayWinnerPercentage = awayWinnerPredictionsTotal > 0 
    ? Math.round((awayWinnerPredictionsCorrect / awayWinnerPredictionsTotal) * 100) 
    : 0;

  const stats = [
    {
      icon: Trophy,
      label: "Total Points",
      value: totalPoints,
      description: "Your cumulative points from all predictions"
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
      value: `${homeWinnerPercentage}/${awayWinnerPercentage}`,
      onClick: userId ? () => setShowHomeAwayDialog(true) : undefined
    },
    {
      icon: ArrowUp,
      label: "Highest Game Points",
      value: highestGamePoints,
      description: "Best performance in a single game"
    }
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            onClick={stat.onClick}
          />
        ))}
      </div>

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