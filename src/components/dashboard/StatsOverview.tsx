import { Trophy, Target, TrendingUp, ArrowUp, ArrowDown, Crown, Medal } from "lucide-react";
import { StatCard } from "./StatCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatsOverviewProps {
  totalPoints: number;
  pointsPerGame: number;
  totalPredictions: number;
  highestGamePoints?: number | null;
  lowestGamePoints?: number | null;
  highestRoundPoints?: number | null;
  lowestRoundPoints?: number | null;
  allTimeRank?: number | null;
  currentRoundRank?: number | null;
}

export function StatsOverview({ 
  totalPoints, 
  pointsPerGame, 
  totalPredictions,
  highestGamePoints,
  lowestGamePoints,
  highestRoundPoints,
  lowestRoundPoints,
  allTimeRank,
  currentRoundRank
}: StatsOverviewProps) {
  const [showAllCards, setShowAllCards] = useState(false);

  const formatRank = (rank: number | null | undefined) => {
    if (!rank) return "-";
    const suffix = ["th", "st", "nd", "rd"];
    const v = rank % 100;
    return rank + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  };

  const allStats = [
    {
      icon: Trophy,
      label: "Total Points",
      value: totalPoints || 0,
      description: "Your cumulative points from all predictions",
      highlight: true,
    },
    {
      icon: Crown,
      label: "All-Time Rank",
      value: formatRank(allTimeRank),
      description: "Your overall ranking among all players since the beginning",
      highlight: true,
    },
    {
      icon: Medal,
      label: "Current Round Rank",
      value: formatRank(currentRoundRank),
      description: "Your current position in this round's leaderboard",
      highlight: true,
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
      description: "Number of predictions you've made so far"
    },
    {
      icon: ArrowUp,
      label: "Highest Game Points",
      value: highestGamePoints || 0,
      description: "Your best performance in a single game prediction"
    },
    {
      icon: ArrowDown,
      label: "Lowest Game Points",
      value: lowestGamePoints || 0,
      description: "Your lowest score in a single game prediction"
    },
    {
      icon: ArrowUp,
      label: "Highest Round Points",
      value: highestRoundPoints || 0,
      description: "Your best total points achieved in a single round"
    },
    {
      icon: ArrowDown,
      label: "Lowest Round Points",
      value: lowestRoundPoints || 0,
      description: "Your lowest total points in a completed round"
    }
  ];

  const visibleStats = showAllCards ? allStats : allStats.slice(0, 2);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
        {visibleStats.map((stat, index) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            highlight={stat.highlight}
          />
        ))}
      </div>
      
      <div className={cn(
        "flex justify-center transition-opacity duration-200",
        "sm:hidden", // Only show on mobile
        showAllCards ? "mt-4" : "mt-2"
      )}>
        <Button 
          variant="outline" 
          onClick={() => setShowAllCards(!showAllCards)}
          className="w-full max-w-xs"
        >
          {showAllCards ? "Show Less" : "Show More Stats"}
        </Button>
      </div>
    </div>
  );
}