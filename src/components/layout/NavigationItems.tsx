import { Home, Settings, Trophy, Target, Users, Scroll } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const getNavigationItems = async (isAuthenticated: boolean) => {
  const authenticatedItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { 
      title: "PREDICT", 
      icon: Target, 
      path: "/predictions",
      className: "bg-primary text-primary-foreground hover:bg-primary/90" 
    },
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