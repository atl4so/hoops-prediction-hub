import { Home, Settings, Trophy, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const getNavigationItems = async (isAuthenticated: boolean) => {
  const authenticatedItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { title: "Predictions", icon: Target, path: "/predictions" },
    { title: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  ];

  const publicItems = [
    { title: "Home", icon: Home, path: "/" },
    { title: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  ];

  if (!isAuthenticated) return publicItems;

  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === 'likasvy@gmail.com';

  if (isAdmin) {
    return [
      ...authenticatedItems,
      { title: "Admin", icon: Settings, path: "/admin" },
    ];
  }

  return authenticatedItems;
};