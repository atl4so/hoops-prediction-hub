import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface RoundSelectorProps {
  selectedRound: string;
  onRoundChange: (round: string) => void;
  className?: string;
}

export function RoundSelector({ selectedRound, onRoundChange, className }: RoundSelectorProps) {
  const { data: rounds } = useQuery({
    queryKey: ["rounds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rounds')
        .select('id, name')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <Select value={selectedRound} onValueChange={onRoundChange}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder="Select round" />
      </SelectTrigger>
      <SelectContent>
        {rounds?.map((round) => (
          <SelectItem key={round.id} value={round.id}>
            {round.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
