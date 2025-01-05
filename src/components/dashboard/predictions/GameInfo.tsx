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
    <div className="space-y-4">
      <GameDateTime date={game.game_date} />
      <div className="grid grid-cols-3 gap-4 sm:gap-6 items-center bg-white/5 backdrop-blur-lg rounded-xl p-4 shadow-xl">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <img
              src={game.home_team.logo_url}
              alt={game.home_team.name}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <p className="text-sm sm:text-base font-medium text-center line-clamp-2 font-display">
            {game.home_team.name}
          </p>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-center font-display">
          {gameResult ? (
            <div className="flex flex-col items-center space-y-2">
              <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                {gameResult.home_score} - {gameResult.away_score}
              </span>
              {gameResult.is_final && (
                <span className="text-xs text-orange-500/80 uppercase tracking-wider font-semibold">
                  Final
                </span>
              )}
            </div>
          ) : (
            <GameCountdown gameDate={game.game_date} />
          )}
        </div>
        <div className="flex flex-col items-center space-y-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <img
              src={game.away_team.logo_url}
              alt={game.away_team.name}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <p className="text-sm sm:text-base font-medium text-center line-clamp-2 font-display">
            {game.away_team.name}
          </p>
        </div>
      </div>
    </div>
  );
}