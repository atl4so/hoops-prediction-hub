import { Target, Shield, Scale, Users, Trophy } from "lucide-react";

export const navigationItems = [
  {
    title: "My Predictions",
    href: "/my-predictions",
    icon: Target,
    public: false
  },
  {
    title: "Following",
    href: "/following",
    icon: Users,
    public: false
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
    public: false
  }
];

export const publicItems = [
  {
    title: "Predict",
    href: "/predict",
    icon: Target,
    public: true
  },
  {
    title: "Teams",
    href: "/teams",
    icon: Shield,
    public: true
  },
  {
    title: "Rules",
    href: "/rules",
    icon: Scale,
    public: true
  }
];