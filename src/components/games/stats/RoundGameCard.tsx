import { format, parse } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import type { ScheduleItem, GameResult } from "@/types/euroleague-api";

interface RoundGameCardProps {
  game: ScheduleItem;
  result?: GameResult;
}

export function RoundGameCard({ game, result }: RoundGameCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-shadow duration-200 cursor-pointer bg-card/50 border-border/50",
        "overflow-hidden"
      )}
      onClick={() => navigate(`/game/${game.game}`)}
    >
      <CardContent className="p-2">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-xs">
            <Badge 
              variant="secondary" 
              className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary text-[10px] px-1.5 py-0"
            >
              Game {game.game}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(game.date + ' ' + game.startime), 'MMM d, HH:mm')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-sm">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate text-sm">
                {game.hometeam}
              </h3>
            </div>
            
            {result && (
              <div className="flex items-center gap-2 px-2 flex-shrink-0">
                <span className={cn(
                  "text-base font-bold tabular-nums",
                  Number(result.homescore) > Number(result.awayscore) ? "text-primary" : "text-muted-foreground"
                )}>
                  {result.homescore}
                </span>
                <span className="text-xs font-medium text-muted-foreground">-</span>
                <span className={cn(
                  "text-base font-bold tabular-nums",
                  Number(result.awayscore) > Number(result.homescore) ? "text-primary" : "text-muted-foreground"
                )}>
                  {result.awayscore}
                </span>
              </div>
            )}
            
            <div className="flex-1 min-w-0 text-right">
              <h3 className="font-medium truncate text-sm">
                {game.awayteam}
              </h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}