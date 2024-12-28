import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface UserPermissionSwitchProps {
  userId: string;
  initialState: boolean;
}

export function UserPermissionSwitch({ userId, initialState }: UserPermissionSwitchProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updatePermission = useMutation({
    mutationFn: async (canViewFuturePredictions: boolean) => {
      if (canViewFuturePredictions) {
        const { error } = await supabase
          .from('user_permissions')
          .upsert(
            {
              user_id: userId,
              can_view_future_predictions: true,
            },
            {
              onConflict: 'user_id'
            }
          );
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_permissions')
          .delete()
          .eq('user_id', userId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['users-with-permissions'] });
      toast({ 
        title: "Success", 
        description: "Permission updated successfully",
        variant: "default"
      });
    },
    onError: (error) => {
      console.error('Permission update error:', error);
      toast({
        title: "Error",
        description: "Failed to update permission",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`permission-${userId}`}
        checked={initialState}
        onCheckedChange={(checked) => {
          console.log('Updating permission for user:', userId, 'to:', checked);
          updatePermission.mutate(checked);
        }}
      />
      <Label htmlFor={`permission-${userId}`}>
        View Future Predictions
      </Label>
    </div>
  );
}