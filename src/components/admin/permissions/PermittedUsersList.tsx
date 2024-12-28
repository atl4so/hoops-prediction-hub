import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PermittedUsersList() {
  const { data: usersWithPermissions, isLoading } = useQuery({
    queryKey: ['users-with-permissions'],
    queryFn: async () => {
      console.log('Fetching users with permissions');
      const { data, error } = await supabase
        .from('user_permissions')
        .select(`
          user_id,
          can_view_future_predictions,
          profiles:user_id (
            id,
            email,
            display_name,
            total_points
          )
        `)
        .eq('can_view_future_predictions', true);
      
      if (error) {
        console.error('Error fetching permissions:', error);
        throw error;
      }
      console.log('Users with permissions:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users with Future Predictions Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Users with Future Predictions Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!usersWithPermissions || usersWithPermissions.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No users have future predictions access
            </div>
          ) : (
            usersWithPermissions.map((permission) => (
              <div
                key={permission.user_id}
                className="flex items-center justify-between p-4 border rounded-lg bg-card"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{permission.profiles.email}</p>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Future Predictions
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Points: {permission.profiles.total_points || 0}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}