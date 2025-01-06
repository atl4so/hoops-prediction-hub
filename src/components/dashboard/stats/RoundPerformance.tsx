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
    <div className="p-6 rounded-xl bg-[#FFF8F0]/95 backdrop-blur-sm border border-neutral-200/30 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <h3 className="text-xl font-semibold mb-4 text-black">Round Performance</h3>
      <div className="space-y-4">
        <Select value={selectedRound} onValueChange={setSelectedRound}>
          <SelectTrigger className="w-full bg-white/80 border-neutral-200/50">
            <SelectValue placeholder="Select a round">
              {selectedRound && rounds?.find(r => r.id === selectedRound)?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-md z-50">
            {rounds?.map((round) => (
              <SelectItem 
                key={round.id} 
                value={round.id}
                className="cursor-pointer hover:bg-accent focus:bg-accent"
              >
                Round {round.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedRound && (
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div className="flex items-center gap-3 bg-white/80 p-4 rounded-lg border border-neutral-200/50">
              <Target className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-black/60">Points</p>
                <p className="text-lg font-semibold text-black">
                  {isLoadingRoundStats ? (
                    <span className="text-black/40">Loading...</span>
                  ) : (
                    roundStats?.points || 0
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/80 p-4 rounded-lg border border-neutral-200/50">
              <Trophy className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-black/60">Rank</p>
                <p className="text-lg font-semibold text-black">
                  {isLoadingRoundStats ? (
                    <span className="text-black/40">Loading...</span>
                  ) : roundStats?.rank ? (
                    <>{roundStats.rank}<span className="text-sm text-black/40">/{roundStats.totalParticipants}</span></>
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