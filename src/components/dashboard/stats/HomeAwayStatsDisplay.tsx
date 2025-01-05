import { Home, Plane } from "lucide-react";

interface HomeAwayStatsDisplayProps {
  homeStats: {
    total: number;
    correct: number;
    percentage: number;
  };
  awayStats: {
    total: number;
    correct: number;
    percentage: number;
  };
}

export function HomeAwayStatsDisplay({ homeStats, awayStats }: HomeAwayStatsDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 rounded-lg border border-[#9b87f5]/20 bg-white space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Home className="h-5 w-5 text-[#9b87f5]" />
          <span className="text-lg font-semibold text-[#1A1F2C]">{homeStats.percentage}%</span>
        </div>
        <p className="text-sm text-center text-[#7E69AB]">
          {homeStats.correct} of {homeStats.total} correct
        </p>
      </div>
      <div className="p-4 rounded-lg border border-[#9b87f5]/20 bg-white space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Plane className="h-5 w-5 text-[#7E69AB]" />
          <span className="text-lg font-semibold text-[#1A1F2C]">{awayStats.percentage}%</span>
        </div>
        <p className="text-sm text-center text-[#7E69AB]">
          {awayStats.correct} of {awayStats.total} correct
        </p>
      </div>
    </div>
  );
}