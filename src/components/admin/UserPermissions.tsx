import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function UserPermissions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState("");

  const { data: users } = useQuery({
    queryKey: ['users-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          permissions:user_permissions(*)
        `)
        .ilike('email', `%${searchEmail}%`)
        .order('email');
      
      if (error) throw error;
      return data;
    },
    enabled: searchEmail.length > 2,
  });

  const updatePermission = useMutation({
    mutationFn: async ({ userId, canViewFuturePredictions }: { userId: string, canViewFuturePredictions: boolean }) => {
      const { error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          can_view_future_predictions: canViewFuturePredictions,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-permissions'] });
      toast({ title: "Success", description: "Permission updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Input
          placeholder="Search user by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {users?.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="space-y-1">
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                Total Points: {user.total_points || 0}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id={`permission-${user.id}`}
                checked={user.permissions?.[0]?.can_view_future_predictions || false}
                onCheckedChange={(checked) =>
                  updatePermission.mutate({
                    userId: user.id,
                    canViewFuturePredictions: checked,
                  })
                }
              />
              <Label htmlFor={`permission-${user.id}`}>
                View Future Predictions
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}