import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserPermissions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState("");

  // Query for all users with permissions
  const { data: usersWithPermissions, isLoading: loadingPermissions } = useQuery({
    queryKey: ['users-with-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          permissions:user_permissions(*)
        `)
        .order('email');
      
      if (error) throw error;
      return data.filter(user => user.permissions?.[0]?.can_view_future_predictions);
    },
  });

  // Query for searched users
  const { data: searchedUsers, isLoading: loadingSearch } = useQuery({
    queryKey: ['users-permissions', searchEmail],
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
        // If turning off permissions, delete the record
        const { error } = await supabase
          .from('user_permissions')
          .delete()
          .eq('user_id', userId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // Invalidate both queries to refresh the lists
      queryClient.invalidateQueries({ queryKey: ['users-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['users-with-permissions'] });
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

      {/* Users with Permissions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users with Future Predictions Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingPermissions ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading users with permissions...
              </div>
            ) : usersWithPermissions?.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No users have future predictions access
              </div>
            ) : (
              usersWithPermissions?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.email}</p>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Future Predictions
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Points: {user.total_points || 0}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="space-y-4">
        {loadingSearch && searchEmail.length > 2 && (
          <div className="text-center py-4 text-muted-foreground">
            Loading users...
          </div>
        )}

        {searchedUsers?.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-card"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{user.email}</p>
                {user.permissions?.[0]?.can_view_future_predictions && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Future Predictions
                  </Badge>
                )}
              </div>
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

        {searchEmail.length > 2 && searchedUsers?.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No users found matching "{searchEmail}"
          </div>
        )}

        {searchEmail.length <= 2 && (
          <div className="text-center py-4 text-muted-foreground">
            Type at least 3 characters to search users
          </div>
        )}
      </div>
    </div>
  );
}