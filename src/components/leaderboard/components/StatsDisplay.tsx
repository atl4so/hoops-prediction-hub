import { TableCell } from "@/components/ui/table";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface StatsDisplayProps {
  winnerPercentage: number;
  isRoundLeaderboard: boolean;
  efficiencyRating?: number;
  underdogRate?: number;
}

export function StatsDisplay({
  winnerPercentage,
  isRoundLeaderboard,
  efficiencyRating,
  underdogRate
}: StatsDisplayProps) {
  return (
    <>
      <td className="text-right py-4 px-4 hidden lg:table-cell">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="space-y-1">
                <span className="font-semibold text-base">{winnerPercentage}%</span>
                {isRoundLeaderboard && (
                  <>
                    <p className="text-xs text-muted-foreground">
                      Efficiency: {Math.round(efficiencyRating || 0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Underdog: {Math.round(underdogRate || 0)}%
                    </p>
                  </>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Winner prediction accuracy</p>
              {isRoundLeaderboard && (
                <>
                  <p className="text-xs text-muted-foreground">Efficiency Rating: Points weighted by accuracy</p>
                  <p className="text-xs text-muted-foreground">Underdog Rate: Success with unpopular picks</p>
                </>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
    </>
  );
}