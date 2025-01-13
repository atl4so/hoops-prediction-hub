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

  // Find the latest round with finished games and calculated points
  useEffect(() => {
    async function findLatestRoundWithFinishedGames() {
      if (!rounds?.length || selectedRound) return;

      try {
        // Get rounds that have user stats with points
        const { data: roundsWithStats, error: statsError } = await supabase
          .from('round_user_stats')
          .select('round_id, total_points')
          .gt('total_points', 0)
          .order('round_id', { ascending: false });

        if (statsError) throw statsError;

        // Get rounds that have finished games with results
        const { data: roundsWithResults, error: resultsError } = await supabase
          .from('games')
          .select(`
            round_id,
            game_results!inner(is_final)
          `)
          .eq('game_results.is_final', true);

        if (resultsError) throw resultsError;

        // Find the latest round that has both stats and results
        const roundsWithData = roundsWithStats?.map(r => r.round_id) || [];
        const roundsWithFinishedGames = roundsWithResults ? Array.from(new Set(roundsWithResults.map(r => r.round_id))) : [];
        
        const validRounds = rounds.filter(round => 
          roundsWithData.includes(round.id) && 
          roundsWithFinishedGames.length > 0 && 
          roundsWithFinishedGames.includes(round.id)
        );

        if (validRounds.length > 0) {
          console.log('Found latest round with data:', validRounds[0].id);
          onRoundChange(validRounds[0].id);
        } else {
          console.log('No rounds with complete data found, defaulting to latest round');
          onRoundChange(rounds[0].id);
        }
      } catch (error) {
        console.error('Error finding latest round with data:', error);
        onRoundChange(rounds[0].id);
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