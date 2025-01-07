import { Target, Shield, Scale } from "lucide-react";

export const navigationItems = [
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

export const authenticatedItems = [
  {
    title: "My Predictions",
    href: "/my-predictions",
    icon: Target,
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
  }
];