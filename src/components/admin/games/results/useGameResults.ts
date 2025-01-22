import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGameResults() {
  const queryClient = useQueryClient();

  const { data: games, isLoading } = useQuery({
    queryKey: ['games-with-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select(`
          id,
          game_date,
          game_code,
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
    mutationFn: async ({ gameId, homeScore, awayScore, gameCode }: { gameId: string, homeScore: number, awayScore: number, gameCode?: string }) => {
      console.log('Starting game result update:', { gameId, homeScore, awayScore, gameCode });
      
      // First update the game result
      const { error: resultError } = await supabase.rpc('update_game_result', {
        game_id_param: gameId,
        home_score_param: homeScore,
        away_score_param: awayScore
      });

      if (resultError) {
        console.error('Game result update error:', resultError);
        throw resultError;
      }

      // Then update the game code if provided
      if (gameCode !== undefined) {
        const { error: codeError } = await supabase
          .from('games')
          .update({ game_code: gameCode.trim() || null })
          .eq('id', gameId);

        if (codeError) {
          console.error('Game code update error:', codeError);
          throw codeError;
        }
      }

      console.log('Game result and code update successful');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games-with-results'] });
      toast.success("Game result updated successfully");
    },
    onError: (error: any) => {
      console.error('Error updating game result:', error);
      toast.error(error.message || "Failed to update game result");
    },
  });

  return {
    games,
    isLoading,
    updateResult
  };
}