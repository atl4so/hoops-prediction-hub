import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { GameListSkeleton } from "./games/GameListSkeleton";
import { EditGameDialog } from "./games/EditGameDialog";
import { GamesByRound } from "./games/GamesByRound";
import { useGameDeletion } from "./games/useGameDeletion";

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
          home_team:teams!games_home_team_id_fkey(id, name, logo_url),
          away_team:teams!games_away_team_id_fkey(id, name, logo_url),
          round:rounds(id, name)
        `)
        .order('game_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteGames = useGameDeletion();

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

  const handleDeleteSelected = async () => {
    if (selectedGames.length === 0) return;
    
    try {
      await deleteGames.mutateAsync(selectedGames);
      setSelectedGames([]); // Clear selection after successful deletion
    } catch (error) {
      console.error('Error in handleDeleteSelected:', error);
    }
  };

  if (isLoading) {
    return <GameListSkeleton />;
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
            onClick={handleDeleteSelected}
            disabled={deleteGames.isPending}
          >
            {deleteGames.isPending ? "Deleting..." : `Delete Selected Games (${selectedGames.length})`}
          </Button>
        </div>
      )}

      <EditGameDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        gameDate={gameDate}
        onGameDateChange={setGameDate}
        gameTime={gameTime}
        onGameTimeChange={setGameTime}
        onUpdate={() => updateGame.mutate()}
      />

      <div className="space-y-12">
        {Object.entries(gamesByRound).map(([roundId, { name, games }]) => (
          <GamesByRound
            key={roundId}
            roundId={roundId}
            roundName={name}
            games={games}
            onEdit={handleEdit}
            onDelete={toggleGameSelection}
            selectedGames={selectedGames}
          />
        ))}
      </div>
    </div>
  );
}