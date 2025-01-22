import { format } from "date-fns";
import { Clock } from "lucide-react";
import { GameDateTime } from "../GameDateTime";

interface GameScoreDisplayProps {
  game: {
    game_date: string;
    home_team: {
      name: string;
      logo_url: string;
    };
    away_team: {
      name: string;
      logo_url: string;
    };
    game_results?: Array<{
      home_score: number;
      away_score: number;
      is_final: boolean;
    }>;
  };
  isUpcoming: boolean;
}

export function GameScoreDisplay({ game, isUpcoming }: GameScoreDisplayProps) {
  const gameResult = game.game_results?.[0];
  const gameDate = new Date(game.game_date);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <GameDateTime date={game.game_date} />
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{format(gameDate, 'HH:mm')}</span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
        <div className="flex flex-col items-center text-center">
          <img
            src={game.home_team.logo_url}
            alt={game.home_team.name}
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
          />
          <p className="mt-2 text-sm font-medium line-clamp-2 h-10">
            {game.home_team.name}
          </p>
        </div>

        <div className="text-center font-mono">
          {gameResult ? (
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-bold tabular-nums">
                {gameResult.home_score} - {gameResult.away_score}
              </div>
              {gameResult.is_final && (
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Final
                </div>
              )}
            </div>
          ) : (
            <div className="text-xl sm:text-2xl font-bold text-muted-foreground">
              vs
            </div>
          )}
        </div>

        <div className="flex flex-col items-center text-center">
          <img
            src={game.away_team.logo_url}
            alt={game.away_team.name}
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
          />
          <p className="mt-2 text-sm font-medium line-clamp-2 h-10">
            {game.away_team.name}
          </p>
        </div>
      </div>
    </div>
  );
}