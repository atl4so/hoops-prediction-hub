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

export function GameCreateForm() {
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

      console.log('Creating game with data:', {
        round_id: selectedRound,
        home_team_id: homeTeam,
        away_team_id: awayTeam,
        game_date: combinedDateTime.toISOString(),
      });

      const { data, error } = await supabase
        .from('games')
        .insert([
          {
            round_id: selectedRound,
            home_team_id: homeTeam,
            away_team_id: awayTeam,
            game_date: combinedDateTime.toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error('Error creating game:', error);
        throw error;
      }

      console.log('Game created successfully:', data);
      return data;
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
      console.error('Error in createGame mutation:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="grid gap-4 relative">
      <Select value={selectedRound} onValueChange={setSelectedRound}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select Round" />
        </SelectTrigger>
        <SelectContent className="bg-white z-[100]">
          {rounds?.map((round) => (
            <SelectItem key={round.id} value={round.id}>
              {round.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={homeTeam} onValueChange={setHomeTeam}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select Home Team" />
        </SelectTrigger>
        <SelectContent className="bg-white z-[100]">
          {teams?.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={awayTeam} onValueChange={setAwayTeam}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select Away Team" />
        </SelectTrigger>
        <SelectContent className="bg-white z-[100]">
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
                "justify-start text-left font-normal bg-white",
                !gameDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {gameDate ? format(gameDate, "PPP") : "Game Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[100]">
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
            className="w-full bg-white"
          />
        </div>
      </div>
      <Button onClick={() => createGame.mutate()} className="bg-primary hover:bg-primary/90">
        Create Game
      </Button>
    </div>
  );
}