import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MarginDistributionProps {
  stats: any;
}

export function MarginDistribution({ stats }: MarginDistributionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className="font-display text-lg font-semibold mb-4 cursor-help">Margin Distribution</h3>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[300px] text-sm">
              Breakdown of victories and defeats by point margin ranges
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h4 className="text-sm font-medium flex items-center gap-2 cursor-help">
                    <ArrowUp className="h-4 w-4 text-green-600" />
                    Wins
                  </h4>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px] text-sm">
                  Distribution of winning margins in different ranges
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between items-center cursor-help">
                      <span className="text-sm text-muted-foreground">1-9 points</span>
                      <span className="font-semibold">{stats?.margin_1_9_wins || 0}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[300px] text-sm">
                    Percentage of wins with a margin between 1 and 9 points
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between items-center cursor-help">
                      <span className="text-sm text-muted-foreground">10-15 points</span>
                      <span className="font-semibold">{stats?.margin_10_15_wins || 0}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[300px] text-sm">
                    Percentage of wins with a margin between 10 and 15 points
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between items-center cursor-help">
                      <span className="text-sm text-muted-foreground">15+ points</span>
                      <span className="font-semibold">{stats?.margin_15plus_wins || 0}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[300px] text-sm">
                    Percentage of wins with a margin greater than 15 points
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="space-y-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h4 className="text-sm font-medium flex items-center gap-2 cursor-help">
                    <ArrowDown className="h-4 w-4 text-red-600" />
                    Losses
                  </h4>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px] text-sm">
                  Distribution of losing margins in different ranges
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between items-center cursor-help">
                      <span className="text-sm text-muted-foreground">1-9 points</span>
                      <span className="font-semibold">{stats?.margin_1_9_losses || 0}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[300px] text-sm">
                    Percentage of losses with a margin between 1 and 9 points
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between items-center cursor-help">
                      <span className="text-sm text-muted-foreground">10-15 points</span>
                      <span className="font-semibold">{stats?.margin_10_15_losses || 0}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[300px] text-sm">
                    Percentage of losses with a margin between 10 and 15 points
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between items-center cursor-help">
                      <span className="text-sm text-muted-foreground">15+ points</span>
                      <span className="font-semibold">{stats?.margin_15plus_losses || 0}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[300px] text-sm">
                    Percentage of losses with a margin greater than 15 points
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
