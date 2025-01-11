import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EditGameResultDialog } from "./EditGameResultDialog";
import { Accordion } from "@/components/ui/accordion";
import { useGameResults } from "@/hooks/useGameResults";
import { RoundResultsSection } from "./games/RoundResultsSection";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";

export function GameResultsList() {
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingResult, setEditingResult] = useState<any>(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  
  const { data: existingResults, isError, error } = useGameResults();

  // Check if user is admin
  if (!session?.user?.email || session.user.email !== 'likasvy@gmail.com') {
    navigate('/login');
    return null;
  }

  const setFinalResult = useMutation({
    mutationFn: async () => {
      console.log('Setting/updating final result for game:', editingResult?.id);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user || session.session.user.email !== 'likasvy@gmail.com') {
        throw new Error('Unauthorized');
      }

      if (!editingResult?.id || !homeScore || !awayScore) {
        throw new Error("Please fill in all fields");
      }

      const hasExistingResult = editingResult.game_results?.length > 0;

      try {
        if (hasExistingResult) {
          // Update existing result
          const { data, error } = await supabase
            .from('game_results')
            .update({
              home_score: parseInt(homeScore),
              away_score: parseInt(awayScore),
              updated_at: new Date().toISOString()
            })
            .eq('id', editingResult.game_results[0].id)
            .select()
            .single();

          if (error) {
            console.error('Error updating game result:', error);
            throw error;
          }
          return data;
        } else {
          // Insert new result
          const { data, error } = await supabase
            .from('game_results')
            .insert({
              game_id: editingResult.id,
              home_score: parseInt(homeScore),
              away_score: parseInt(awayScore),
              is_final: true
            })
            .select()
            .single();

          if (error) {
            console.error('Error inserting game result:', error);
            throw error;
          }
          return data;
        }
      } catch (error) {
        console.error('Database operation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({ 
        title: "Success", 
        description: editingResult.game_results?.length > 0 
          ? "Game result updated successfully"
          : "Game result set successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['game-results'] });
      setEditingResult(null);
      setHomeScore("");
      setAwayScore("");
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSetResult = (result: any) => {
    setEditingResult(result);
    if (result.game_results?.length > 0) {
      setHomeScore(result.game_results[0].home_score.toString());
      setAwayScore(result.game_results[0].away_score.toString());
    } else {
      setHomeScore("");
      setAwayScore("");
    }
  };

  if (isError) {
    return (
      <div className="text-center py-4 text-destructive">
        Error loading game results: {(error as Error)?.message || 'Unknown error'}
      </div>
    );
  }

  // Group results by round
  const resultsByRound = existingResults?.reduce((acc, result) => {
    const roundId = result.round.id;
    const roundName = result.round.name;
    
    if (!acc[roundId]) {
      acc[roundId] = {
        roundName,
        results: []
      };
    }
    
    acc[roundId].results.push(result);
    return acc;
  }, {} as Record<string, { roundName: string; results: typeof existingResults }>) || {};

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Manage Game Results</h3>
      
      <Accordion type="single" collapsible className="space-y-4">
        {Object.entries(resultsByRound).map(([roundId, { roundName, results }]) => (
          <RoundResultsSection
            key={roundId}
            roundId={roundId}
            roundName={roundName}
            results={results}
            onEdit={handleSetResult}
          />
        ))}
      </Accordion>

      {(!existingResults || existingResults.length === 0) && (
        <p className="text-muted-foreground text-center py-4">
          No games found
        </p>
      )}

      <EditGameResultDialog
        result={editingResult}
        open={!!editingResult}
        onOpenChange={() => setEditingResult(null)}
        homeScore={homeScore}
        awayScore={awayScore}
        onHomeScoreChange={setHomeScore}
        onAwayScoreChange={setAwayScore}
        onUpdate={() => setFinalResult.mutate()}
        isPending={setFinalResult.isPending}
      />
    </div>
  );
}