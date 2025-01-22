import { format } from "date-fns";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InsightsButton } from "./prediction/insights/InsightsButton";
import { StatsButton } from "./stats/StatsButton";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: {
    id: string;
    game_date: string;
    home_team: {
      name: string;
      logo_url: string;
    };
    away_team: {
      name: string;
      logo_url: string;
    };
    round: {
      name: string;
    };
    arena: {
      name: string;
      capacity: number;
    };
    game_results?: Array<{
      home_score: number;
      away_score: number;
      is_final: boolean;
    }>;
  };
  onClick?: () => void;
  className?: string;
}

export function GameCard({ game, onClick, className }: GameCardProps) {
  const gameResult = game.game_results?.[0];

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-lg",
        "bg-gradient-to-br from-background to-accent/5",
        className
      )}
      onClick={onClick}
    >
      <div className="p-6 space-y-6">
        {/* Teams and Score Section */}
        <div className="grid grid-cols-3 items-center gap-4">
          {/* Home Team */}
          <div className="flex flex-col items-center text-center">
            <img
              src={game.home_team.logo_url}
              alt={game.home_team.name}
              className="w-16 h-16 object-contain mb-2"
            />
            <h3 className="text-sm sm:text-base font-semibold line-clamp-2">
              {game.home_team.name}
            </h3>
            {gameResult && (
              <span className="text-2xl sm:text-3xl font-bold text-primary tabular-nums mt-1">
                {gameResult.home_score}
              </span>
            )}
          </div>

          {/* VS */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground">VS</span>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center text-center">
            <img
              src={game.away_team.logo_url}
              alt={game.away_team.name}
              className="w-16 h-16 object-contain mb-2"
            />
            <h3 className="text-sm sm:text-base font-semibold line-clamp-2">
              {game.away_team.name}
            </h3>
            {gameResult && (
              <span className="text-2xl sm:text-3xl font-bold text-primary tabular-nums mt-1">
                {gameResult.away_score}
              </span>
            )}
          </div>
        </div>

        {/* Game Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(game.game_date), "MMMM d, yyyy 'at' HH:mm")}</span>
          </div>

          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>{game.round.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{game.arena.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Capacity: {game.arena.capacity.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          {gameResult && (
            <InsightsButton
              onClick={() => {}}
              gameResult={gameResult}
              className="text-xs"
            />
          )}
          <StatsButton onClick={() => {}} className="text-xs" />
        </div>
      </div>
    </Card>
  );
}