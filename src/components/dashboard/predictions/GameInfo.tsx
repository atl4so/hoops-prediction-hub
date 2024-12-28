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
  prediction?: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  } | null;
}

export function GameInfo({ game, prediction }: GameInfoProps) {
  if (!game || !game.home_team || !game.away_team) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Game information unavailable
      </div>
    );
  }

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
          {prediction && (
            <p className="text-sm font-medium text-primary mt-1">
              {prediction.prediction_home_score}
            </p>
          )}
        </div>
        <div className="text-xl font-semibold text-center">
          {gameResult ? (
            <div className="flex flex-col items-center">
              <span>{gameResult.home_score} - {gameResult.away_score}</span>
              {gameResult.is_final && (
                <span className="text-xs text-muted-foreground mt-1">Final</span>
              )}
            </div>
          ) : prediction ? (
            <div className="flex flex-col items-center">
              <span className="text-base text-primary">Prediction</span>
              <span className="text-lg">
                {prediction.prediction_home_score} - {prediction.prediction_away_score}
              </span>
              {prediction.points_earned !== undefined && (
                <span className="text-sm text-primary mt-1">
                  Points: {prediction.points_earned}
                </span>
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
          {prediction && (
            <p className="text-sm font-medium text-primary mt-1">
              {prediction.prediction_away_score}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}