import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
      // Also invalidate predictions and profiles as they will be updated by the trigger
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
          <div
            key={result.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {format(new Date(result.game.game_date), "PPP")}
              </p>
              <h4 className="font-medium">
                {result.game.home_team.name} {result.home_score} - {result.away_score} {result.game.away_team.name}
              </h4>
            </div>
            <Button 
              variant="outline"
              onClick={() => handleEdit(result)}
              className="text-[#8B5CF6] hover:text-[#7C3AED] hover:bg-[#8B5CF6]/10"
            >
              Edit Result
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!editingResult} onOpenChange={() => setEditingResult(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Game Result</DialogTitle>
          </DialogHeader>
          
          {editingResult && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {format(new Date(editingResult.game.game_date), "PPP")}
                </p>
                <p className="font-medium">
                  {editingResult.game.home_team.name} vs {editingResult.game.away_team.name}
                </p>
              </div>

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
                className="w-full"
                onClick={() => updateResult.mutate()}
                disabled={updateResult.isPending}
              >
                {updateResult.isPending ? "Updating..." : "Update Result"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}