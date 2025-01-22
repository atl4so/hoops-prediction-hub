import { LayoutDashboard, Trophy, Target, Users2, ScrollText, Scale, Shield, BarChart3 } from "lucide-react";

export const navigationItems = [
  {
    title: "Overview",
    href: "/overview",
    icon: LayoutDashboard,
    public: false
  },
  {
    title: "Predict",
    href: "/predict",
    icon: Target,
    public: true
  },
  {
    title: "My Predictions",
    href: "/my-predictions",
    icon: ScrollText,
    public: false
  },
  {
    title: "Following",
    href: "/following",
    icon: Users2,
    public: false
  },
  {
    title: "Teams",
    href: "/teams",
    icon: Shield,
    public: true
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
    public: false
  },
  {
    title: "Rules",
    href: "/rules",
    icon: Scale,
    public: true
  },
  {
    title: "Game Stats",
    href: "/game-stats",
    icon: BarChart3,
    public: true
  },
];