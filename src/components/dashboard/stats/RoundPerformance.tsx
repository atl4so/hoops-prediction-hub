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

  const { data: roundPoints, isLoading: isLoadingRoundPoints } = useQuery({
    queryKey: ["roundPoints", selectedRound, userId],
    queryFn: async () => {
      if (!selectedRound) return null;
      
      const { data: rankings, error } = await supabase
        .rpc('get_round_rankings', { round_id: selectedRound });
        
      if (error) {
        console.error('Error fetching round rankings:', error);
        return null;
      }

      const userRanking = rankings?.find(r => r.user_id === userId);
      return userRanking?.total_points || 0;
    },
    enabled: !!selectedRound && !!userId,
  });

  return (
    <div className="p-6 bg-accent/5 rounded-lg border">
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
            {isLoadingRoundPoints ? (
              <span className="text-muted-foreground">Loading...</span>
            ) : (
              <>
                Points: <span className="font-semibold">{roundPoints}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}