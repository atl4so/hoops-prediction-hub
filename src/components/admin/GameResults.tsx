import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function GameResults() {
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [scores, setScores] = useState({ home: "", away: "" });

  // Check if user is admin
  if (!session?.user?.email || session.user.email !== 'likasvy@gmail.com') {
    navigate('/login');
    return null;
  }

  const { data: games, isLoading } = useQuery({
    queryKey: ['games-with-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select(`
          id,
          game_date,
          home_team:teams!games_home_team_id_fkey(id, name, logo_url),
          away_team:teams!games_away_team_id_fkey(id, name, logo_url),
          game_results (
            id,
            home_score,
            away_score,
            is_final
          )
        `)
        .order('game_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateResult = useMutation({
    mutationFn: async ({ gameId, homeScore, awayScore }: { gameId: string, homeScore: number, awayScore: number }) => {
      console.log('Starting game result update:', { gameId, homeScore, awayScore });
      
      try {
        const { error } = await supabase.rpc(
          'update_game_result',
          {
            game_id_param: gameId,
            home_score_param: homeScore,
            away_score_param: awayScore
          }
        );

        if (error) {
          console.error('Supabase RPC error:', error);
          throw error;
        }

        console.log('Game result update successful');
        return true;
      } catch (error) {
        console.error('Error in updateResult mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games-with-results'] });
      setEditingGame(null);
      setScores({ home: "", away: "" });
      toast.success("Game result updated successfully");
    },
    onError: (error) => {
      console.error('Error updating game result:', error);
      toast.error("Failed to update game result");
    },
  });

  const handleEdit = (game: any) => {
    setEditingGame(game.id);
    setScores({
      home: game.game_results?.[0]?.home_score?.toString() || "",
      away: game.game_results?.[0]?.away_score?.toString() || ""
    });
  };

  const handleSave = async (gameId: string) => {
    const homeScore = parseInt(scores.home);
    const awayScore = parseInt(scores.away);

    if (isNaN(homeScore) || isNaN(awayScore)) {
      toast.error("Please enter valid scores");
      return;
    }

    try {
      await updateResult.mutateAsync({ gameId, homeScore, awayScore });
    } catch (error) {
      console.error('Error in handleSave:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Game Results</h2>
      </div>

      <div className="grid gap-4">
        {games?.map((game) => (
          <Card key={game.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {format(new Date(game.game_date), "MMM d, yyyy HH:mm")}
              </CardTitle>
              <CardDescription>
                {game.home_team.name} vs {game.away_team.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {editingGame === game.id ? (
                  <>
                    <Input
                      type="number"
                      value={scores.home}
                      onChange={(e) => setScores(prev => ({ ...prev, home: e.target.value }))}
                      className="w-20"
                      placeholder="Home"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      value={scores.away}
                      onChange={(e) => setScores(prev => ({ ...prev, away: e.target.value }))}
                      className="w-20"
                      placeholder="Away"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        onClick={() => handleSave(game.id)}
                        disabled={updateResult.isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditingGame(null);
                          setScores({ home: "", away: "" });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      {game.game_results?.[0] ? (
                        <span className="text-lg">
                          {game.game_results[0].home_score} - {game.game_results[0].away_score}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No result</span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(game)}
                    >
                      {game.game_results?.[0] ? "Edit Result" : "Set Result"}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}