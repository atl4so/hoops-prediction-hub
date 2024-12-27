import { Home, Trophy, Users, User, BarChart2 } from "lucide-react";

export const getNavigationItems = (isAuthenticated: boolean) => {
  const authenticatedItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { title: "Leaderboard", icon: Trophy, path: "/leaderboard" },
    { title: "Following", icon: Users, path: "/following" },
    { title: "Profile", icon: User, path: "/profile" },
    { title: "Statistics", icon: BarChart2, path: "/statistics" },
  ];

  const publicItems = [
    { title: "Home", icon: Home, path: "/" },
  ];

  return isAuthenticated ? authenticatedItems : publicItems;
};