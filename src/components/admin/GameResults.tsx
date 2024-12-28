import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export function GameResults() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");

  const { data: games } = useQuery({
    queryKey: ['games-without-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select(`
          id,
          game_date,
          home_team:teams!games_home_team_id_fkey(name),
          away_team:teams!games_away_team_id_fkey(name)
        `)
        .not('id', 'in', `(select game_id from game_results)`)
        .order('game_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: existingResults } = useQuery({
    queryKey: ['game-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_results')
        .select(`
          *,
          game:games(
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey(name),
            away_team:teams!games_away_team_id_fkey(name)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createResult = useMutation({
    mutationFn: async () => {
      if (!selectedGame || !homeScore || !awayScore) {
        throw new Error("Please fill in all fields");
      }

      const { error } = await supabase
        .from('game_results')
        .insert([
          {
            game_id: selectedGame,
            home_score: parseInt(homeScore),
            away_score: parseInt(awayScore),
          },
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-results'] });
      queryClient.invalidateQueries({ queryKey: ['games-without-results'] });
      toast({ title: "Success", description: "Game result saved successfully" });
      setSelectedGame("");
      setHomeScore("");
      setAwayScore("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Select value={selectedGame} onValueChange={setSelectedGame}>
          <SelectTrigger>
            <SelectValue placeholder="Select Game" />
          </SelectTrigger>
          <SelectContent>
            {games?.map((game) => (
              <SelectItem key={game.id} value={game.id}>
                {game.home_team.name} vs {game.away_team.name} ({format(new Date(game.game_date), "PPP")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Home Score"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Away Score"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
          />
        </div>

        <Button onClick={() => createResult.mutate()}>Save Result</Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Existing Results</h3>
        <div className="grid gap-4">
          {existingResults?.map((result) => (
            <div
              key={result.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(result.game.game_date), "PPP")}
                </p>
                <h4 className="font-medium">
                  {result.game.home_team.name} {result.home_score} - {result.away_score} {result.game.away_team.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}