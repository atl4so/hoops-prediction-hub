import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useGameDeletion() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameIds: string[]) => {
      const results = [];
      
      for (const gameId of gameIds) {
        console.log('Attempting to delete game:', gameId);
        
        try {
          // Delete everything in one transaction
          const { data, error } = await supabase.rpc('delete_game_completely', {
            game_id: gameId
          });
          
          if (error) {
            console.error('Error in deletion process:', error);
            throw error;
          }
          
          results.push({ id: gameId });
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