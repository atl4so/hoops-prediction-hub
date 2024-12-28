import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Users } from "lucide-react";

export function PermittedUsersList() {
  const { data: usersWithPermissions, isLoading } = useQuery({
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
          {isLoading ? (
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
  );
}