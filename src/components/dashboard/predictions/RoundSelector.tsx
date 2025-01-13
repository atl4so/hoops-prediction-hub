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

  // Find the latest round with finished games and points
  useEffect(() => {
    async function findLatestRoundWithFinishedGames() {
      if (!rounds?.length || selectedRound) return;

      for (const round of rounds) {
        try {
          // Check for games with final results and calculated points
          const { data: gamesWithPoints } = await supabase
            .from('games')
            .select(`
              id,
              game_results!inner(is_final),
              predictions!inner(points_earned)
            `)
            .eq('round_id', round.id)
            .eq('game_results.is_final', true)
            .not('predictions.points_earned', 'is', null)
            .limit(1);

          if (gamesWithPoints?.length) {
            console.log('Found round with finished games and points:', round.id);
            onRoundChange(round.id);
            break;
          }
        } catch (error) {
          console.error('Error finding latest round with finished games:', error);
          continue;
        }
      }
    }

    findLatestRoundWithFinishedGames();
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