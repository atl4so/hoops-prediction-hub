import { Trophy, Target, TrendingUp, ArrowUp, ArrowDown, Crown, Medal } from "lucide-react";
import { StatCard } from "./StatCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  userId: string;
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
  currentRoundRank,
  userId
}: StatsOverviewProps) {
  const [showAllCards, setShowAllCards] = useState(false);
  const [selectedRound, setSelectedRound] = useState<string>("");
  const isMobile = useIsMobile();

  const { data: rounds } = useQuery({
    queryKey: ["rounds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rounds")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: roundPoints } = useQuery({
    queryKey: ["roundPoints", selectedRound, userId],
    queryFn: async () => {
      if (!selectedRound) return null;
      const { data, error } = await supabase
        .rpc("get_round_rankings", { round_id: selectedRound })
        .single();
      if (error) return null;
      return data?.total_points || 0;
    },
    enabled: !!selectedRound && !!userId,
  });

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
      description: "Your overall ranking among all players",
      highlight: true,
    },
    {
      icon: Medal,
      label: "Latest Round Rank",
      value: formatRank(currentRoundRank),
      description: "Your position in latest round's leaderboard",
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
      description: "Number of predictions you've made"
    },
    {
      icon: ArrowUp,
      label: "Highest Game Points",
      value: highestGamePoints || 0,
      description: "Best performance in a single game"
    },
    {
      icon: ArrowDown,
      label: "Lowest Game Points",
      value: lowestGamePoints || 0,
      description: "Lowest score in a single game"
    },
    {
      icon: ArrowUp,
      label: "Highest Round Points",
      value: highestRoundPoints || 0,
      description: "Best total points in a single round"
    },
    {
      icon: ArrowDown,
      label: "Lowest Round Points",
      value: lowestRoundPoints || 0,
      description: "Lowest total points in a round"
    }
  ];

  const visibleStats = isMobile 
    ? (showAllCards ? allStats : allStats.slice(0, 2))
    : allStats;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
      
      <div className="mt-8 p-6 bg-accent/5 rounded-lg border animate-fade-in">
        <h3 className="text-lg font-semibold mb-4">Round Performance</h3>
        <div className="flex gap-4 items-center flex-wrap">
          <Select value={selectedRound} onValueChange={setSelectedRound}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a round" />
            </SelectTrigger>
            <SelectContent>
              {rounds?.map((round) => (
                <SelectItem key={round.id} value={round.id}>
                  Round {round.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedRound && (
            <div className="text-lg animate-fade-in">
              Points: <span className="font-semibold">{roundPoints || 0}</span>
            </div>
          )}
        </div>
      </div>
      
      {isMobile && (
        <div className={cn(
          "flex justify-center transition-all duration-300",
          showAllCards ? "mt-6" : "mt-4"
        )}>
          <Button 
            variant="outline" 
            onClick={() => setShowAllCards(!showAllCards)}
            className="w-full max-w-xs"
          >
            {showAllCards ? "Show Less" : "Show More Stats"}
          </Button>
        </div>
      )}
    </div>
  );
}