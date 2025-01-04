import { Home, Settings, Trophy, Target, Users, Scroll, ListChecks } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const getNavigationItems = async (isAuthenticated: boolean) => {
  const authenticatedItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { title: "Predict", icon: Target, path: "/predict" },
    { title: "My Predictions", icon: ListChecks, path: "/my-predictions" },
    { title: "Following", icon: Users, path: "/following" },
    { title: "Leaderboard", icon: Trophy, path: "/leaderboard" },
    { title: "Rules", icon: Scroll, path: "/rules" },
  ];

  const publicItems = [
    { title: "Home", icon: Home, path: "/" },
    { title: "Leaderboard", icon: Trophy, path: "/leaderboard" },
    { title: "Rules", icon: Scroll, path: "/rules" },
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