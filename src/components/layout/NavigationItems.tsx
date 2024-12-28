import { Home, Trophy, Users, User, BarChart2, Settings } from "lucide-react";

export const getNavigationItems = (isAuthenticated: boolean) => {
  const authenticatedItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { title: "Leaderboard", icon: Trophy, path: "/leaderboard" },
    { title: "Following", icon: Users, path: "/following" },
    { title: "Profile", icon: User, path: "/profile" },
    { title: "Statistics", icon: BarChart2, path: "/statistics" },
  ];

  const adminItems = [
    ...authenticatedItems,
    { title: "Admin", icon: Settings, path: "/admin" },
  ];

  const publicItems = [
    { title: "Home", icon: Home, path: "/" },
  ];

  const isAdmin = supabase.auth.getUser().then(({ data }) => {
    return data.user?.email === 'likasvy@gmail.com';
  });

  return isAuthenticated ? (isAdmin ? adminItems : authenticatedItems) : publicItems;
};