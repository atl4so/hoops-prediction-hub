import { Card, CardContent } from "@/components/ui/card";

interface GameStatsProps {
  game: any; // We'll type this properly later
}

export function GameStats({ game }: GameStatsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Team Statistics</h3>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-left">{game.localclub.name}</div>
            <div className="text-center font-semibold">Stat</div>
            <div className="text-right">{game.roadclub.name}</div>
            
            {/* Field Goals */}
            <div className="text-left">
              {game.localclub.totals.total.FieldGoalsPercent}%
            </div>
            <div className="text-center text-muted-foreground">Field Goals</div>
            <div className="text-right">
              {game.roadclub.totals.total.FieldGoalsPercent}%
            </div>
            
            {/* Rebounds */}
            <div className="text-left">
              {game.localclub.totals.total.TotalRebounds}
            </div>
            <div className="text-center text-muted-foreground">Rebounds</div>
            <div className="text-right">
              {game.roadclub.totals.total.TotalRebounds}
            </div>
            
            {/* Assists */}
            <div className="text-left">
              {game.localclub.totals.total.Assistances}
            </div>
            <div className="text-center text-muted-foreground">Assists</div>
            <div className="text-right">
              {game.roadclub.totals.total.Assistances}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}