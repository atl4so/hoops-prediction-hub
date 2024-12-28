import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface GameResultItemProps {
  result: any;
  onEdit: (result: any) => void;
}

export function GameResultItem({ result, onEdit }: GameResultItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          {format(new Date(result.game.game_date), "PPP")}
        </p>
        <h4 className="font-medium">
          {result.game.home_team.name} {result.home_score} - {result.away_score} {result.game.away_team.name}
        </h4>
      </div>
      <Button 
        variant="outline"
        onClick={() => onEdit(result)}
        className="text-[#8B5CF6] hover:text-[#7C3AED] hover:bg-[#8B5CF6]/10"
      >
        Edit Result
      </Button>
    </div>
  );
}