import { LayoutDashboard, Trophy, Target, Users2, ScrollText, Scale } from "lucide-react";

export const navigationItems = [
  {
    title: "Overview",
    href: "/overview",
    icon: LayoutDashboard,
  },
  {
    title: "Predict",
    href: "/predict",
    icon: Target,
  },
  {
    title: "My Predictions",
    href: "/my-predictions",
    icon: ScrollText,
  },
  {
    title: "Following",
    href: "/following",
    icon: Users2,
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    title: "Rules",
    href: "/rules",
    icon: Scale,
  },
];