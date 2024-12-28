import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <Select value={selectedRound} onValueChange={onRoundChange}>
      <SelectTrigger>
        <SelectValue placeholder="Filter by round" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Rounds</SelectItem>
        {rounds?.map((round) => (
          <SelectItem key={round.id} value={round.id}>
            Round {round.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}