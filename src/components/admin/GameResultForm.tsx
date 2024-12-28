import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export function GameResultForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");

  // First, fetch all game results to get their game_ids
  const { data: gameResults } = useQuery({
    queryKey: ['game-results-ids'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_results')
        .select('game_id');
      
      if (error) throw error;
      return data;
    },
  });

  // Then fetch games that don't have results
  const { data: games } = useQuery({
    queryKey: ['games-without-results', gameResults],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select(`
          id,
          game_date,
          home_team:teams!games_home_team_id_fkey(name),
          away_team:teams!games_away_team_id_fkey(name)
        `)
        .order('game_date', { ascending: true });
      
      if (error) throw error;

      // Filter out games that already have results
      const gameIdsWithResults = new Set(gameResults?.map(r => r.game_id) || []);
      return data.filter(game => !gameIdsWithResults.has(game.id));
    },
    enabled: true,
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
      queryClient.invalidateQueries({ queryKey: ['game-results-ids'] });
      // Also invalidate predictions and profiles as they will be updated by the trigger
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      
      toast({ 
        title: "Success", 
        description: "Game result saved and points calculated successfully",
      });
      
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

      <Button 
        onClick={() => createResult.mutate()}
        disabled={createResult.isPending}
      >
        {createResult.isPending ? "Saving..." : "Save Result"}
      </Button>
    </div>
  );
}