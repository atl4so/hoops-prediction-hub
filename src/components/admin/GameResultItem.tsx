import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface GameResultItemProps {
  result: any;
  onEdit: (result: any) => void;
}

export function GameResultItem({ result, onEdit }: GameResultItemProps) {
  const hasResult = result.game_results?.length > 0;
  const finalResult = hasResult ? result.game_results[0] : null;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          {format(new Date(result.game_date), "PPP")}
        </p>
        <h4 className="font-medium">
          {result.home_team.name} vs {result.away_team.name}
        </h4>
        {finalResult && (
          <p className="text-sm text-muted-foreground">
            Final Score: {finalResult.home_score} - {finalResult.away_score}
          </p>
        )}
      </div>
      {!hasResult && (
        <Button 
          variant="outline"
          onClick={() => onEdit(result)}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          Set Final Result
        </Button>
      )}
    </div>
  );
}