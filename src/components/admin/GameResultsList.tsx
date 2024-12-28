import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GameResultItem } from "./GameResultItem";
import { EditGameResultDialog } from "./EditGameResultDialog";

export function GameResultsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingResult, setEditingResult] = useState<any>(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

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

  const updateResult = useMutation({
    mutationFn: async () => {
      if (!editingResult || !homeScore || !awayScore) {
        throw new Error("Please fill in all fields");
      }

      const { error } = await supabase
        .from('game_results')
        .update({
          home_score: parseInt(homeScore),
          away_score: parseInt(awayScore),
        })
        .eq('id', editingResult.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-results'] });
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      
      toast({ 
        title: "Success", 
        description: "Game result updated and points recalculated successfully",
      });
      
      setEditingResult(null);
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

  const handleEdit = (result: any) => {
    setEditingResult(result);
    setHomeScore(result.home_score.toString());
    setAwayScore(result.away_score.toString());
  };

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