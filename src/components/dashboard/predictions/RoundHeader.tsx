import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

interface RoundHeaderProps {
  roundName: string;
  gamesCount: number;
  isExpanded: boolean;
  onCollapse: () => void;
}

export function RoundHeader({ 
  roundName, 
  gamesCount, 
  isExpanded, 
  onCollapse 
}: RoundHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-display font-semibold tracking-tight">
          Round {roundName}
        </h2>
        <p className="text-sm text-muted-foreground">
          {gamesCount} {gamesCount === 1 ? 'game' : 'games'} in this round
        </p>
      </div>
      {isExpanded && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCollapse}
          className="hidden sm:flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group"
        >
          Show Less 
          <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
        </Button>
      )}
    </div>
  );
}