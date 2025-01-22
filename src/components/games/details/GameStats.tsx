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
  // Combine all players for top performers calculation
  const allPlayers = [
    ...(Array.isArray(game.localclub.playerstats.stat) 
      ? game.localclub.playerstats.stat 
      : [game.localclub.playerstats.stat]),
    ...(Array.isArray(game.roadclub.playerstats.stat) 
      ? game.roadclub.playerstats.stat 
      : [game.roadclub.playerstats.stat])
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <TopPerformers players={allPlayers} />
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