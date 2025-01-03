import { Trophy, Target, TrendingUp, ArrowUp, CheckCircle, Crown, Medal } from "lucide-react";
import { StatCard } from "./StatCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

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
  lowestGamePoints,
  highestRoundPoints,
  lowestRoundPoints,
  allTimeRank,
  currentRoundRank,
  winnerPredictionsCorrect = 0,
  winnerPredictionsTotal = 0,
}: StatsListProps) {
  const [showAllCards, setShowAllCards] = useState(false);
  const isMobile = useIsMobile();

  // Calculate winner percentage only from games with final results
  const winnerPercentage = winnerPredictionsTotal > 0
    ? Math.round((winnerPredictionsCorrect / winnerPredictionsTotal) * 100)
    : 0;

  const allStats = [
    {
      icon: Trophy,
      label: "Total Points",
      value: totalPoints || 0,
      description: "Your cumulative points from all predictions",
      highlight: true
    },
    {
      icon: Crown,
      label: "All-Time Rank",
      value: formatRank(allTimeRank),
      description: "Your overall ranking among all players",
      highlight: true
    },
    {
      icon: Medal,
      label: "Latest Round Rank",
      value: formatRank(currentRoundRank?.rank),
      description: `Your position in Round ${currentRoundRank?.roundName} leaderboard`,
      highlight: true
    },
    {
      icon: CheckCircle,
      label: "Winner Predictions",
      value: `${winnerPercentage}%`,
      description: `Correctly predicted ${winnerPredictionsCorrect} winners out of ${winnerPredictionsTotal} finished games`,
      highlight: true
    },
    {
      icon: Target,
      label: "Points per Game",
      value: (pointsPerGame || 0).toFixed(1),
      description: "Average points earned per prediction",
      highlight: true
    },
    {
      icon: TrendingUp,
      label: "Total Predictions",
      value: totalPredictions || 0,
      description: "Number of predictions you've made",
      highlight: true
    },
    {
      icon: ArrowUp,
      label: "Highest Game Points",
      value: highestGamePoints || 0,
      description: "Best performance in a single game",
      highlight: true
    },
    {
      icon: ArrowUp,
      label: "Highest Round Points",
      value: highestRoundPoints || 0,
      description: "Best total points in a single round",
      highlight: true
    }
  ];

  const visibleStats = isMobile 
    ? (showAllCards ? allStats : allStats.slice(0, 3))
    : allStats;

  return (
    <div>
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      )}>
        {visibleStats.map((stat, index) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            highlight={stat.highlight}
            delay={index}
          />
        ))}
      </div>
      {isMobile && allStats.length > 3 && (
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setShowAllCards(!showAllCards)}
        >
          {showAllCards ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
}