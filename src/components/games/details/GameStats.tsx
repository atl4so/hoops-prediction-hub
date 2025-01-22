import { Card, CardContent } from "@/components/ui/card";
import { PlayerStatsTable } from "./PlayerStatsTable";
import { TopPerformers } from "./TopPerformers";

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
      <div className="grid gap-6 md:grid-cols-2">
        <TopPerformers 
          players={Array.isArray(game.localclub.playerstats.stat) 
            ? game.localclub.playerstats.stat 
            : [game.localclub.playerstats.stat]}
          teamName={game.localclub.name}
        />
        <TopPerformers 
          players={Array.isArray(game.roadclub.playerstats.stat) 
            ? game.roadclub.playerstats.stat 
            : [game.roadclub.playerstats.stat]}
          teamName={game.roadclub.name}
        />
      </div>
    </div>
  );
}