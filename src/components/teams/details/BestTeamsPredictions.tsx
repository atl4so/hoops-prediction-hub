import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TeamDisplay } from "@/components/games/TeamDisplay";
import { cn } from "@/lib/utils";

interface BestTeamsPredictionsProps {
  teams: Array<{
    team: {
      name: string;
      logo_url: string;
    };
    success_rate: number;
    total_predictions: number;
  }>;
}

export function BestTeamsPredictions({ teams }: BestTeamsPredictionsProps) {
  if (!teams?.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Trophy className="h-5 w-5" />
        <h3 className="font-semibold">Best Predicted Teams</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((item, index) => (
          <Card key={item.team.name} className={cn(
            "group transition-all duration-300 hover:shadow-lg border-2",
            "hover:scale-[1.02] hover:-translate-y-0.5",
            "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
          )}>
            <CardContent className="p-4">
              <div className="flex flex-col items-center gap-3">
                <TeamDisplay 
                  team={item.team} 
                  imageClassName="w-12 h-12"
                />
                <div className="text-center space-y-1">
                  <p className="text-2xl font-bold text-primary">
                    {item.success_rate}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.total_predictions} predictions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}