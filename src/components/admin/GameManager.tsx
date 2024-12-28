import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

export function GameManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRound, setSelectedRound] = useState<string>("");
  const [homeTeam, setHomeTeam] = useState<string>("");
  const [awayTeam, setAwayTeam] = useState<string>("");
  const [gameDate, setGameDate] = useState<Date>();
  const [gameTime, setGameTime] = useState<string>("20:00");

  const { data: rounds } = useQuery({
    queryKey: ['rounds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rounds')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: games, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          home_team:teams!games_home_team_id_fkey(name),
          away_team:teams!games_away_team_id_fkey(name),
          round:rounds(name)
        `)
        .order('game_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const createGame = useMutation({
    mutationFn: async () => {
      if (!selectedRound || !homeTeam || !awayTeam || !gameDate) {
        throw new Error("Please fill in all fields");
      }

      // Combine date and time
      const [hours, minutes] = gameTime.split(':');
      const combinedDateTime = new Date(gameDate);
      combinedDateTime.setHours(parseInt(hours, 10));
      combinedDateTime.setMinutes(parseInt(minutes, 10));

      const { error } = await supabase
        .from('games')
        .insert([
          {
            round_id: selectedRound,
            home_team_id: homeTeam,
            away_team_id: awayTeam,
            game_date: combinedDateTime.toISOString(),
          },
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      toast({ title: "Success", description: "Game created successfully" });
      setSelectedRound("");
      setHomeTeam("");
      setAwayTeam("");
      setGameDate(undefined);
      setGameTime("20:00");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-4">
          <Select value={selectedRound} onValueChange={setSelectedRound}>
            <SelectTrigger>
              <SelectValue placeholder="Select Round" />
            </SelectTrigger>
            <SelectContent>
              {rounds?.map((round) => (
                <SelectItem key={round.id} value={round.id}>
                  {round.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={homeTeam} onValueChange={setHomeTeam}>
            <SelectTrigger>
              <SelectValue placeholder="Select Home Team" />
            </SelectTrigger>
            <SelectContent>
              {teams?.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={awayTeam} onValueChange={setAwayTeam}>
            <SelectTrigger>
              <SelectValue placeholder="Select Away Team" />
            </SelectTrigger>
            <SelectContent>
              {teams?.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !gameDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {gameDate ? format(gameDate, "PPP") : "Game Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={gameDate}
                  onSelect={setGameDate}
                />
              </PopoverContent>
            </Popover>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={gameTime}
                onChange={(e) => setGameTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <Button onClick={() => createGame.mutate()}>Create Game</Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Existing Games</h3>
        <div className="grid gap-4">
          {games?.map((game) => (
            <div
              key={game.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="text-sm text-muted-foreground">{game.round.name}</p>
                <h4 className="font-medium">
                  {game.home_team.name} vs {game.away_team.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(game.game_date), "PPP p")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}