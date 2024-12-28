import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GameCard } from "@/components/games/GameCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export function GamesList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<any>(null);
  const [gameDate, setGameDate] = useState<Date>();
  const [gameTime, setGameTime] = useState("20:00");

  const { data: games, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select(`
          id,
          game_date,
          home_team:teams!games_home_team_id_fkey(name, logo_url),
          away_team:teams!games_away_team_id_fkey(name, logo_url),
          round:rounds(id, name)
        `)
        .order('game_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteGames = useMutation({
    mutationFn: async (gameIds: string[]) => {
      const { error } = await supabase
        .from('games')
        .delete()
        .in('id', gameIds);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      setSelectedGames([]);
      toast({ title: "Success", description: "Games deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateGame = useMutation({
    mutationFn: async () => {
      if (!gameDate || !gameTime || !editingGame) {
        throw new Error("Please fill in all fields");
      }

      const [hours, minutes] = gameTime.split(':');
      const combinedDateTime = new Date(gameDate);
      combinedDateTime.setHours(parseInt(hours, 10));
      combinedDateTime.setMinutes(parseInt(minutes, 10));

      const { error } = await supabase
        .from('games')
        .update({
          game_date: combinedDateTime.toISOString(),
        })
        .eq('id', editingGame.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      setIsEditOpen(false);
      setEditingGame(null);
      setGameDate(undefined);
      setGameTime("20:00");
      toast({ title: "Success", description: "Game updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (game: any) => {
    setEditingGame(game);
    const date = new Date(game.game_date);
    setGameDate(date);
    setGameTime(format(date, "HH:mm"));
    setIsEditOpen(true);
  };

  const toggleGameSelection = (gameId: string) => {
    setSelectedGames(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((roundIndex) => (
          <div key={roundIndex} className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[200px]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Group games by round
  const gamesByRound = games?.reduce((acc, game) => {
    const roundId = game.round.id;
    if (!acc[roundId]) {
      acc[roundId] = {
        name: game.round.name,
        games: []
      };
    }
    acc[roundId].games.push(game);
    return acc;
  }, {} as Record<string, { name: string; games: typeof games }>) || {};

  return (
    <div className="space-y-4">
      {selectedGames.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => deleteGames.mutate(selectedGames)}
          >
            Delete Selected Games ({selectedGames.length})
          </Button>
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Game Date/Time</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !gameDate && "text-muted-foreground"
                  )}
                >
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
            <Input
              type="time"
              value={gameTime}
              onChange={(e) => setGameTime(e.target.value)}
            />
            <Button onClick={() => updateGame.mutate()}>Update Game</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-12">
        {Object.entries(gamesByRound).map(([roundId, { name, games }]) => (
          <section key={roundId} className="space-y-6">
            <h2 className="text-2xl font-display font-semibold tracking-tight">
              Round {name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => (
                <div key={game.id} className="relative">
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleEdit(game)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedGames.includes(game.id) ? "default" : "secondary"}
                      size="icon"
                      onClick={() => toggleGameSelection(game.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <GameCard 
                    game={game} 
                    isAuthenticated={true}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}