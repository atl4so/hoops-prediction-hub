import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GameResultForm } from "./GameResultForm";
import { GameResultsList } from "./GameResultsList";
import { toast } from "sonner";

export function GameResults() {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const { mutate: submitGameResult } = useMutation({
    mutationFn: async ({ gameId, homeScore, awayScore }: { 
      gameId: string; 
      homeScore: string; 
      awayScore: string; 
    }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user || session.session.user.email !== 'likasvy@gmail.com') {
        throw new Error('Unauthorized');
      }

      const { data, error } = await supabase
        .from('game_results')
        .insert([
          {
            game_id: gameId,
            home_score: parseInt(homeScore),
            away_score: parseInt(awayScore),
            is_final: true
          }
        ]);

      if (error) throw error;
      return data;
    },
    onMutate: () => {
      setIsPending(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games-without-results'] });
      queryClient.invalidateQueries({ queryKey: ['game-results'] });
      toast.success('Game result saved successfully');
    },
    onError: (error) => {
      console.error('Error saving game result:', error);
      toast.error('Failed to save game result. Please make sure you are logged in as admin.');
    },
    onSettled: () => {
      setIsPending(false);
    }
  });

  const handleSubmit = (gameId: string, homeScore: string, awayScore: string) => {
    submitGameResult({ gameId, homeScore, awayScore });
  };

  return (
    <div className="space-y-6">
      <GameResultForm onSubmit={handleSubmit} isPending={isPending} />
      <GameResultsList />
    </div>
  );
}