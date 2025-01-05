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
  return (
    <Button
      variant="ghost"
      className="h-auto p-0 hover:bg-transparent"
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
                    <TooltipContent side="right" className="max-w-[250px]">
                      Total number of games played by {team.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="cursor-help">Predictions: {stats?.total_predictions || 0}</p>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[250px]">
                      Total number of predictions made by users for {team.name}'s games. Multiple users can predict the same game.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="cursor-help">Success Rate: {stats?.overall_success_rate || 0}%</p>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[250px]">
                      Percentage of correct predictions made for {team.name}'s games. A higher percentage means users are better at predicting this team's results.
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