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
        const { data, error } = await supabase
          .from('games')
          .delete()
          .eq('id', gameId)
          .select(); // Add select() to get the response data
        
        if (error) {
          console.error('Error deleting game:', error);
          throw error;
        }
        
        results.push(data);
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