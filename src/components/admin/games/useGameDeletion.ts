import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGameDeletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameId: string) => {
      if (!gameId) {
        throw new Error('Game ID is required');
      }

      console.log('Attempting to delete game:', gameId);
      
      try {
        // Delete the game directly using DELETE query instead of RPC
        const { data, error } = await supabase
          .from('games')
          .delete()
          .eq('id', gameId);
        
        if (error) {
          console.error('Error in deletion process:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Error in deletion process:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Game deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
    onError: (error) => {
      console.error('Error deleting game:', error);
      toast.error('Failed to delete game');
    }
  });
}