import { Trophy, Target, TrendingUp, ArrowUp, Crown, Medal, Percent, Scale } from "lucide-react";
import { StatCardItem } from "./StatCardItem";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface StatsGridProps {
  stats: Array<{
    icon: typeof Trophy;
    label: string;
    value: string | number;
    description?: string;
    onClick?: () => void;
  }>;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const [showAllCards, setShowAllCards] = useState(false);
  const isMobile = useIsMobile();

  const visibleStats = isMobile 
    ? (showAllCards ? stats : stats.slice(0, 4))
    : stats;

  return (
    <div>
      <div className={cn(
        "grid gap-2 sm:gap-4",
        isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      )}>
        {visibleStats.map((stat, index) => (
          <StatCardItem
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            onClick={stat.onClick}
            delay={index}
          />
        ))}
      </div>
      {isMobile && stats.length > 4 && (
        <Button
          variant="outline"
          className="w-full mt-4 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary"
          onClick={() => setShowAllCards(!showAllCards)}
        >
          {showAllCards ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
}