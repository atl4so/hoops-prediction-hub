import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface Game {
  id: string;
  game_date: string;
  home_team: {
    name: string;
  };
  away_team: {
    name: string;
  };
  game_results: GameResult[] | null;
}

interface GameResult {
  id: string;
  home_score: number;
  away_score: number;
}

interface GameResultFormProps {
  onSubmit: (gameId: string, homeScore: string, awayScore: string) => void;
  isPending: boolean;
}

export function GameResultForm({ onSubmit, isPending }: GameResultFormProps) {
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  const { data: games, isLoading, error } = useQuery({
    queryKey: ["games-without-results"],
    queryFn: async () => {
      console.log("Fetching games without results...");
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user || session.session.user.email !== 'likasvy@gmail.com') {
        throw new Error('Unauthorized');
      }

      const { data: gamesData, error: gamesError } = await supabase
        .from("games")
        .select(`
          id,
          game_date,
          home_team:home_team_id(name),
          away_team:away_team_id(name),
          game_results(id, home_score, away_score)
        `)
        .order('game_date', { ascending: false });

      if (gamesError) {
        console.error('Error fetching games:', gamesError);
        throw gamesError;
      }

      console.log("Fetched games:", gamesData);
      
      const typedGames = gamesData as unknown as Game[];
      
      return typedGames.filter(game => 
        !game.game_results || game.game_results.length === 0
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGame && homeScore && awayScore) {
      onSubmit(selectedGame, homeScore, awayScore);
      // Reset form
      setSelectedGame("");
      setHomeScore("");
      setAwayScore("");
    }
  };

  if (error) {
    return <div>Error loading games: {(error as Error).message}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="game">Select Game</Label>
        <Select
          value={selectedGame}
          onValueChange={setSelectedGame}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a game" />
          </SelectTrigger>
          <SelectContent>
            {games?.map((game) => (
              <SelectItem key={game.id} value={game.id}>
                {format(new Date(game.game_date), "MMM d, yyyy")} -{" "}
                {game.home_team.name} vs {game.away_team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="homeScore">Home Score</Label>
          <Input
            id="homeScore"
            type="number"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            min="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="awayScore">Away Score</Label>
          <Input
            id="awayScore"
            type="number"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            min="0"
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={!selectedGame || !homeScore || !awayScore || isPending}
        className="w-full"
      >
        {isPending ? "Saving..." : "Save Result"}
      </Button>
    </form>
  );
}