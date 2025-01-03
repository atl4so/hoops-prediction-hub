import { useState } from "react";
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
    <div className="p-6 bg-accent/5 rounded-lg border">
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
            <div className="flex items-center gap-2 bg-background p-4 rounded-lg border">
              <Target className="h-5 w-5 text-primary" />
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

            <div className="flex items-center gap-2 bg-background p-4 rounded-lg border">
              <Trophy className="h-5 w-5 text-primary" />
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
    </div>
  );
}