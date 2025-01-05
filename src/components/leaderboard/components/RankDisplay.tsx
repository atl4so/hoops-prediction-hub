import { Trophy, Medal, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankDisplayProps {
  rank: number;
}

export function RankDisplay({ rank }: RankDisplayProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return rank <= 10 ? <Star className="h-5 w-5 text-primary/40" /> : null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getRankIcon(rank)}
      <span className={cn(
        "font-bold text-base",
        rank === 1 ? "text-yellow-500" :
        rank === 2 ? "text-gray-400" :
        rank === 3 ? "text-amber-600" :
        rank <= 10 ? "text-primary/70" : ""
      )}>
        {rank}
      </span>
    </div>
  );
}