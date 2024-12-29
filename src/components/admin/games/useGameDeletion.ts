import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useGameDeletion() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameIds: string[]) => {
      // Delete one game at a time to avoid issues with the response stream
      for (const gameId of gameIds) {
        const { error } = await supabase
          .from('games')
          .delete()
          .eq('id', gameId);
        
        if (error) throw error;
      }
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