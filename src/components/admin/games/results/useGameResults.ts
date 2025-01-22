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
      
      const { data: resultData, error: resultError } = await supabase.rpc('update_game_result', {
        game_id_param: gameId,
        home_score_param: homeScore,
        away_score_param: awayScore
      });

      if (resultError) {
        console.error('RPC Error:', resultError);
        throw resultError;
      }

      if (gameCode) {
        const { error: codeError } = await supabase.rpc('update_game_code', {
          p_game_id: gameId,
          p_game_code: gameCode
        });

        if (codeError) {
          console.error('Game code update error:', codeError);
          throw codeError;
        }
      }

      console.log('Game result update successful');
      return resultData;
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