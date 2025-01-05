import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
                <p>Games: {stats?.total_games || 0}</p>
                <p>Predictions: {stats?.total_predictions || 0}</p>
                <p>Success Rate: {stats?.overall_success_rate || 0}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Button>
  );
}