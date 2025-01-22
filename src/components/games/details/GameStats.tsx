import { Card, CardContent } from "@/components/ui/card";
import { PlayerStatsTable } from "./PlayerStatsTable";

interface GameStatsProps {
  game: {
    localclub: {
      name: string;
      score: number;
      playerstats: {
        stat: any;
      };
    };
    roadclub: {
      name: string;
      score: number;
      playerstats: {
        stat: any;
      };
    };
  };
}

export function GameStats({ game }: GameStatsProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <PlayerStatsTable 
        players={game.localclub.playerstats.stat}
        teamName={game.localclub.name}
        teamScore={game.localclub.score}
      />
      <PlayerStatsTable 
        players={game.roadclub.playerstats.stat}
        teamName={game.roadclub.name}
        teamScore={game.roadclub.score}
      />
    </div>
  );
}