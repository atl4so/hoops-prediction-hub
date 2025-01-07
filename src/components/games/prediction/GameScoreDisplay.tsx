import { GameDateTime } from "../GameDateTime";
import { CountdownTimer } from "../CountdownTimer";
import { TeamDisplay } from "../TeamDisplay";

interface GameScoreDisplayProps {
  game: {
    id: string;
    game_date: string;
    home_team: {
      id: string;
      name: string;
      logo_url: string;
    };
    away_team: {
      id: string;
      name: string;
      logo_url: string;
    };
  };
  isUpcoming: boolean;
}

export function GameScoreDisplay({ game, isUpcoming }: GameScoreDisplayProps) {
  return (
    <>
      <div className="text-center mb-4">
        <GameDateTime date={game.game_date} />
        {isUpcoming && (
          <div className="text-primary text-sm mt-2">
            <CountdownTimer gameDate={game.game_date} />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4 items-center flex-1">
        <TeamDisplay
          align="right"
          team={game.home_team}
        />
        <div className="text-center text-xl font-bold">
          vs
        </div>
        <TeamDisplay
          align="left"
          team={game.away_team}
        />
      </div>
    </>
  );
}