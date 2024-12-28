import { GameDateTime } from "@/components/games/GameDateTime";

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
}

export function GameInfo({ game }: GameInfoProps) {
  const gameResult = game.game_results?.[0];

  return (
    <div className="space-y-4 w-full">
      <GameDateTime date={game.game_date} />
      <div className="grid grid-cols-3 items-center gap-4 w-full">
        <div className="flex flex-col items-center">
          <img
            src={game.home_team.logo_url}
            alt={game.home_team.name}
            className="w-16 h-16 object-contain"
          />
          <p className="text-sm mt-2 text-center">{game.home_team.name}</p>
        </div>
        <div className="text-xl font-semibold text-center">
          {gameResult ? (
            <div className="flex flex-col items-center">
              <span>{gameResult.home_score} - {gameResult.away_score}</span>
              {gameResult.is_final && (
                <span className="text-xs text-muted-foreground mt-1">Final</span>
              )}
            </div>
          ) : (
            <span>vs</span>
          )}
        </div>
        <div className="flex flex-col items-center">
          <img
            src={game.away_team.logo_url}
            alt={game.away_team.name}
            className="w-16 h-16 object-contain"
          />
          <p className="text-sm mt-2 text-center">{game.away_team.name}</p>
        </div>
      </div>
    </div>
  );
}