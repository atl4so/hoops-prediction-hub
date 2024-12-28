import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserPermissions() {
  return useQuery({
    queryKey: ["user-future-predictions-permission"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      console.log('Fetching permissions for user:', user.id);

      const { data, error } = await supabase
        .from("user_permissions")
        .select("can_view_future_predictions")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user permissions:", error);
        return null;
      }

      console.log('User permissions:', data);
      return data;
    }
  });
}