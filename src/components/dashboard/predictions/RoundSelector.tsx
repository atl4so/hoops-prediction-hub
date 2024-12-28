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

interface RoundSelectorProps {
  selectedRound: string;
  onRoundChange: (roundId: string) => void;
}

export function RoundSelector({ selectedRound, onRoundChange }: RoundSelectorProps) {
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

  // Set the latest round as default when rounds are loaded
  useEffect(() => {
    if (rounds && rounds.length > 0 && !selectedRound) {
      onRoundChange(rounds[0].id);
    }
  }, [rounds, selectedRound, onRoundChange]);

  if (!rounds?.length) return null;

  return (
    <Select value={selectedRound} onValueChange={onRoundChange}>
      <SelectTrigger>
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
  );
}