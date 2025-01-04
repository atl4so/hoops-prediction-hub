import { GameDateTime } from "@/components/games/GameDateTime";
import { GameCountdown } from "@/components/games/GameCountdown";

interface GameInfoProps {
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
      is_final?: boolean;
    }>;
  };
  prediction?: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  } | null;
}

export function GameInfo({ game, prediction }: GameInfoProps) {
  const gameResult = game.game_results?.[0];

  return (
    <div className="space-y-3">
      <GameDateTime date={game.game_date} />
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
        <div className="flex flex-col items-center">
          <img
            src={game.home_team.logo_url}
            alt={game.home_team.name}
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
          />
          <p className="text-xs sm:text-sm mt-2 text-center line-clamp-2">
            {game.home_team.name}
          </p>
        </div>
        <div className="text-lg sm:text-xl font-semibold text-center">
          {gameResult ? (
            <div className="flex flex-col items-center">
              <span>{gameResult.home_score} - {gameResult.away_score}</span>
              {gameResult.is_final && (
                <span className="text-xs text-muted-foreground mt-1">Final</span>
              )}
            </div>
          ) : (
            <GameCountdown gameDate={game.game_date} />
          )}
        </div>
        <div className="flex flex-col items-center">
          <img
            src={game.away_team.logo_url}
            alt={game.away_team.name}
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
          />
          <p className="text-xs sm:text-sm mt-2 text-center line-clamp-2">
            {game.away_team.name}
          </p>
        </div>
      </div>
    </div>
  );
}