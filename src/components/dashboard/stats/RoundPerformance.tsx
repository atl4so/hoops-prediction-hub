import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RoundPerformanceProps {
  userId: string;
}

export function RoundPerformance({ userId }: RoundPerformanceProps) {
  const [selectedRound, setSelectedRound] = useState<string>("");

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

  // Find latest round with finished games
  useEffect(() => {
    async function findLatestRoundWithFinishedGames() {
      if (!rounds?.length) return;

      for (const round of rounds) {
        const { data: finishedGames } = await supabase
          .from('games')
          .select('id, game_results!inner(is_final)')
          .eq('round_id', round.id)
          .eq('game_results.is_final', true)
          .limit(1);

        if (finishedGames?.length) {
          setSelectedRound(round.id);
          break;
        }
      }
    }

    if (!selectedRound && rounds?.length) {
      findLatestRoundWithFinishedGames();
    }
  }, [rounds, selectedRound]);

  const { data: roundStats, isLoading: isLoadingRoundStats } = useQuery({
    queryKey: ["roundStats", selectedRound, userId],
    queryFn: async () => {
      if (!selectedRound) return null;
      
      const { data: rankings, error } = await supabase
        .rpc('get_round_rankings', { round_id: selectedRound });
        
      if (error) {
        console.error('Error fetching round rankings:', error);
        return null;
      }

      const userRanking = rankings?.find(r => r.user_id === userId);
      const rank = rankings?.findIndex(r => r.user_id === userId) + 1 || 0;
      const totalParticipants = rankings?.length || 0;

      return {
        points: userRanking?.total_points || 0,
        rank,
        totalParticipants
      };
    },
    enabled: !!selectedRound && !!userId,
  });

  return (
    <Card className={cn(
      "bg-gradient-to-br from-white/80 to-white/40 dark:from-green-950/40 dark:to-green-900/20",
      "border border-white/20 dark:border-white/10",
      "backdrop-blur-md shadow-lg hover:shadow-xl",
      "transition-all duration-300"
    )}>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Round Performance</h3>
        <div className="space-y-4">
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
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div className={cn(
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-green-950/40 dark:to-green-900/20",
                "border border-white/20 dark:border-white/10",
                "backdrop-blur-md shadow-lg",
                "flex items-center gap-2 p-4 rounded-lg"
              )}>
                <Target className="h-5 w-5 text-[#F97316]" />
                <div>
                  <p className="text-sm text-muted-foreground">Points</p>
                  <p className="text-lg font-semibold">
                    {isLoadingRoundStats ? (
                      <span className="text-muted-foreground">Loading...</span>
                    ) : (
                      roundStats?.points || 0
                    )}
                  </p>
                </div>
              </div>

              <div className={cn(
                "bg-gradient-to-br from-white/80 to-white/40 dark:from-green-950/40 dark:to-green-900/20",
                "border border-white/20 dark:border-white/10",
                "backdrop-blur-md shadow-lg",
                "flex items-center gap-2 p-4 rounded-lg"
              )}>
                <Trophy className="h-5 w-5 text-[#F97316]" />
                <div>
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className="text-lg font-semibold">
                    {isLoadingRoundStats ? (
                      <span className="text-muted-foreground">Loading...</span>
                    ) : roundStats?.rank ? (
                      <>{roundStats.rank}<span className="text-sm text-muted-foreground">/{roundStats.totalParticipants}</span></>
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}