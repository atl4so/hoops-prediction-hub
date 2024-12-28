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
      console.log('Updating permission:', { userId, canViewFuturePredictions });
      
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
        // When disabling permission, delete the record
        const { error } = await supabase
          .from('user_permissions')
          .delete()
          .eq('user_id', userId);
        if (error) throw error;
      }
    },
    onSuccess: (_, canViewFuturePredictions) => {
      console.log('Permission update successful');
      // Invalidate both queries to refresh the lists
      queryClient.invalidateQueries({ queryKey: ['users-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['users-with-permissions'] });
      
      toast({ 
        title: "Success", 
        description: `Permission ${canViewFuturePredictions ? 'enabled' : 'disabled'} successfully`,
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

  const handleToggle = (checked: boolean) => {
    console.log('Toggle clicked:', { userId, checked });
    updatePermission.mutate(checked);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`permission-${userId}`}
        checked={initialState}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor={`permission-${userId}`}>
        View Future Predictions
      </Label>
    </div>
  );
}