import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GameResultItem } from "./GameResultItem";
import { EditGameResultDialog } from "./EditGameResultDialog";
import { useEffect } from "react";

export function GameResultsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingResult, setEditingResult] = useState<any>(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  // Set up real-time subscription for game results
  useEffect(() => {
    console.log('Setting up game results subscription...');
    
    const channel = supabase
      .channel('game-results-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_results'
        },
        (payload) => {
          console.log('Game result changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['game-results'] });
          // Also invalidate related queries
          queryClient.invalidateQueries({ queryKey: ['predictions'] });
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
        }
      )
      .subscribe((status) => {
        console.log('Game results subscription status:', status);
      });

    return () => {
      console.log('Cleaning up game results subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: existingResults, isError } = useQuery({
    queryKey: ['game-results'],
    queryFn: async () => {
      console.log('Fetching game results...');
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
      
      if (error) {
        console.error('Error fetching game results:', error);
        throw error;
      }
      console.log('Fetched game results:', data);
      return data || [];
    },
  });

  const updateResult = useMutation({
    mutationFn: async () => {
      if (!editingResult || !homeScore || !awayScore) {
        throw new Error("Please fill in all fields");
      }

      console.log('Updating game result:', {
        id: editingResult.id,
        home_score: homeScore,
        away_score: awayScore
      });

      const { error } = await supabase
        .from('game_results')
        .update({
          home_score: parseInt(homeScore),
          away_score: parseInt(awayScore),
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingResult.id);

      if (error) {
        console.error('Error updating game result:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({ 
        title: "Success", 
        description: "Game result updated and points recalculated successfully",
      });
      
      setEditingResult(null);
      setHomeScore("");
      setAwayScore("");
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (result: any) => {
    setEditingResult(result);
    setHomeScore(result.home_score.toString());
    setAwayScore(result.away_score.toString());
  };

  if (isError) {
    return (
      <div className="text-center py-4 text-destructive">
        Error loading game results. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Existing Results</h3>
      <div className="grid gap-4">
        {existingResults?.map((result) => (
          <GameResultItem
            key={result.id}
            result={result}
            onEdit={handleEdit}
          />
        ))}
        {(!existingResults || existingResults.length === 0) && (
          <p className="text-muted-foreground text-center py-4">
            No game results found
          </p>
        )}
      </div>

      <EditGameResultDialog
        result={editingResult}
        open={!!editingResult}
        onOpenChange={() => setEditingResult(null)}
        homeScore={homeScore}
        awayScore={awayScore}
        onHomeScoreChange={setHomeScore}
        onAwayScoreChange={setAwayScore}
        onUpdate={() => updateResult.mutate()}
        isPending={updateResult.isPending}
      />
    </div>
  );
}