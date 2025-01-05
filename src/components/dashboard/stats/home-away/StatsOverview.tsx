import { Home, Plane } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    total: number;
    correct: number;
    percentage: number;
  };
  type: 'home' | 'away';
}

export function StatsOverview({ stats, type }: StatsOverviewProps) {
  const Icon = type === 'home' ? Home : Plane;
  
  return (
    <div className="text-center space-y-1 p-3 bg-muted/10 rounded-lg">
      <div className="flex items-center justify-center gap-2">
        <Icon className="h-4 w-4" />
        <p className="text-xl font-bold">{stats.percentage}%</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Correctly predicted {stats.correct} {type} wins out of {stats.total}
      </p>
    </div>
  );
}