import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Team } from "@/types/supabase";

interface TeamCardProps {
  team: Team;
  stats: any;
  onClick: () => void;
}

export function TeamCard({ team, stats, onClick }: TeamCardProps) {
  const winRate = stats?.overall_success_rate || 0;
  const totalPredictions = stats?.total_predictions || 0;
  const winsPredicted = stats?.wins_predicted || 0;
  const lossesPredicted = stats?.losses_predicted || 0;

  return (
    <Button
      variant="ghost"
      className="h-auto p-0 hover:bg-transparent w-full"
      onClick={onClick}
    >
      <Card className="w-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <img
              src={team.logo_url}
              alt={`${team.name} logo`}
              className="h-16 w-16 object-contain"
            />
            <div className="flex-1 text-left">
              <h3 className="font-display text-lg font-semibold">{team.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="cursor-help">Games: {stats?.total_games || 0}</p>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start" className="max-w-[200px] text-sm">
                      Total number of games played by {team.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="cursor-help">Predictions: {totalPredictions}</p>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start" className="max-w-[200px] text-sm">
                      Total number of predictions made for {team.name}'s games
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="cursor-help">Win Rate: {Math.round(winRate)}%</p>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start" className="max-w-[200px] text-sm">
                      Percentage of correct predictions for {team.name}'s games
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="cursor-help">Predictions (W/L): {winsPredicted}/{lossesPredicted}</p>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start" className="max-w-[200px] text-sm">
                      Number of wins vs losses predicted for {team.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Button>
  );
}