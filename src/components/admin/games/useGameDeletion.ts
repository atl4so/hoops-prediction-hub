import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useGameDeletion() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameIds: string[]) => {
      const results = [];
      
      // Delete one game at a time
      for (const gameId of gameIds) {
        console.log('Attempting to delete game:', gameId);
        
        try {
          // First delete related game_results
          const { error: resultError } = await supabase
            .from('game_results')
            .delete()
            .eq('game_id', gameId);
            
          if (resultError) {
            console.error('Error deleting game results:', resultError);
            throw resultError;
          }
          
          // Then delete predictions
          const { error: predError } = await supabase
            .from('predictions')
            .delete()
            .eq('game_id', gameId);
            
          if (predError) {
            console.error('Error deleting predictions:', predError);
            throw predError;
          }
          
          // Finally delete the game
          const { data, error: gameError } = await supabase
            .from('games')
            .delete()
            .eq('id', gameId)
            .select('id')
            .single();
          
          if (gameError) {
            console.error('Error deleting game:', gameError);
            throw gameError;
          }
          
          results.push(data);
          console.log('Successfully deleted game:', gameId);
        } catch (error) {
          console.error('Error in deletion process:', error);
          throw error;
        }
      }
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      toast({ title: "Success", description: "Games deleted successfully" });
    },
    onError: (error: any) => {
      console.error('Error deleting games:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}