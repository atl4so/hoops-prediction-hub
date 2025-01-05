import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface StatsDisplayProps {
  winnerPercentage: number;
  homeWinPercentage: number;
  awayWinPercentage: number;
  homeTotalStats: string;
  awayTotalStats: string;
  winnerStats: string;
  isRoundLeaderboard?: boolean;
}

export function StatsDisplay({
  winnerPercentage,
  homeWinPercentage,
  awayWinPercentage,
  homeTotalStats,
  awayTotalStats,
  winnerStats,
  isRoundLeaderboard = false
}: StatsDisplayProps) {
  if (isRoundLeaderboard) return null;

  return (
    <>
      <td className="text-right py-4 px-4 hidden lg:table-cell">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="font-semibold text-base">{winnerPercentage}%</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Winner prediction accuracy</p>
              <p className="text-xs text-muted-foreground">{winnerStats}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
      <td className="text-right py-4 px-4 hidden xl:table-cell">
        <div className="space-y-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="font-semibold text-base">{homeWinPercentage}% / {awayWinPercentage}%</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home/Away prediction accuracy</p>
                <p className="text-xs text-muted-foreground">{homeTotalStats}</p>
                <p className="text-xs text-muted-foreground">{awayTotalStats}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </td>
    </>
  );
}