import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { UserPermissionSwitch } from "./UserPermissionSwitch";

export function UserPermissionsList({ searchEmail }: { searchEmail: string }) {
  const { data: searchedUsers, isLoading } = useQuery({
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

  if (isLoading && searchEmail.length > 2) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Loading users...
      </div>
    );
  }

  if (searchEmail.length <= 2) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Type at least 3 characters to search users
      </div>
    );
  }

  if (searchedUsers?.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No users found matching "{searchEmail}"
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchedUsers?.map((user) => (
        <Card key={user.id} className="bg-card">
          <CardContent className="pt-6 flex items-center justify-between">
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
            <UserPermissionSwitch 
              userId={user.id} 
              initialState={user.permissions?.[0]?.can_view_future_predictions || false} 
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}