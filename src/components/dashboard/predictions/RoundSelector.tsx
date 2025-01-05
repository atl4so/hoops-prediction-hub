import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RoundSelectorProps {
  selectedRound: string;
  onRoundChange: (roundId: string) => void;
  className?: string;
}

export function RoundSelector({ selectedRound, onRoundChange, className }: RoundSelectorProps) {
  const { data: rounds, error } = useQuery({
    queryKey: ["rounds"],
    queryFn: async () => {
      console.log('Fetching rounds...');
      const { data, error } = await supabase
        .from("rounds")
        .select("*")
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching rounds:', error);
        throw error;
      }

      console.log('Fetched rounds:', data);
      return data;
    },
    retry: 3,
    meta: {
      errorMessage: "Failed to load rounds. Please try again later."
    }
  });

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch rounds:', error);
      toast.error("Failed to load rounds. Please try again later.");
    }
  }, [error]);

  // Find the latest round with data and set it as default
  useEffect(() => {
    async function findLatestRoundWithData() {
      if (!rounds?.length || selectedRound) return;

      for (const round of rounds) {
        try {
          // First, get games for this round
          const { data: games, error: gamesError } = await supabase
            .from('games')
            .select('id')
            .eq('round_id', round.id);

          if (gamesError || !games?.length) continue;

          const gameIds = games.map(g => g.id);

          // Then, check if any of these games have results
          const { data: gameResults, error: resultsError } = await supabase
            .from('game_results')
            .select('game_id')
            .in('game_id', gameIds);

          if (resultsError || !gameResults?.length) continue;

          const gameResultIds = gameResults.map(gr => gr.game_id);

          // Finally, check if there are any predictions for these games
          const { data: predictions, error: predictionsError } = await supabase
            .from('predictions')
            .select('id')
            .in('game_id', gameResultIds)
            .limit(1);

          if (predictionsError) continue;

          if (predictions?.length) {
            onRoundChange(round.id);
            break;
          }
        } catch (error) {
          console.error('Error finding latest round with data:', error);
          continue;
        }
      }
    }

    findLatestRoundWithData();
  }, [rounds, selectedRound, onRoundChange]);

  if (!rounds?.length) return null;

  return (
    <Select value={selectedRound} onValueChange={onRoundChange}>
      <SelectTrigger className={cn("w-full bg-white", className)}>
        <SelectValue placeholder="Select a round">
          {selectedRound && rounds.find(r => r.id === selectedRound)?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white shadow-lg border z-50">
        {rounds?.map((round) => (
          <SelectItem key={round.id} value={round.id} className="cursor-pointer">
            Round {round.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}