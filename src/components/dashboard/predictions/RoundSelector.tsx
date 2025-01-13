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

interface RoundSelectorProps {
  selectedRound: string;
  onRoundChange: (roundId: string) => void;
  className?: string;
}

export function RoundSelector({ selectedRound, onRoundChange, className }: RoundSelectorProps) {
  const { data: rounds } = useQuery({
    queryKey: ["rounds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rounds")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (rounds && rounds.length > 0 && !selectedRound) {
      onRoundChange(rounds[0].id);
    }
  }, [rounds, selectedRound, onRoundChange]);

  if (!rounds?.length) return null;

  return (
    <Select value={selectedRound} onValueChange={onRoundChange}>
      <SelectTrigger className={cn(
        "w-full bg-background dark:bg-card dark:text-foreground dark:border-muted shadow-sm",
        className
      )}>
        <SelectValue placeholder="Select a round">
          {selectedRound && rounds.find(r => r.id === selectedRound)?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-background dark:bg-card dark:text-foreground dark:border-muted shadow-lg z-50">
        {rounds?.map((round) => (
          <SelectItem 
            key={round.id} 
            value={round.id} 
            className="cursor-pointer dark:focus:bg-accent/50 dark:hover:bg-accent/50"
          >
            Round {round.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}