import { Home, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const getNavigationItems = async (isAuthenticated: boolean) => {
  const authenticatedItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
  ];

  const adminItems = [
    ...authenticatedItems,
    { title: "Admin", icon: Settings, path: "/admin" },
  ];

  const publicItems = [
    { title: "Home", icon: Home, path: "/" },
  ];

  if (!isAuthenticated) return publicItems;

  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === 'likasvy@gmail.com';

  return isAdmin ? adminItems : authenticatedItems;
};