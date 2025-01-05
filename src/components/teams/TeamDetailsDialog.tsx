import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamOverview } from "./details/TeamOverview";
import { TeamPredictionPatterns } from "./details/TeamPredictionPatterns";
import { TeamTopPredictors } from "./details/TeamTopPredictors";
import type { Team } from "@/types/supabase";

interface TeamDetailsDialogProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamDetailsDialog({ team, open, onOpenChange }: TeamDetailsDialogProps) {
  const { data: stats } = useQuery({
    queryKey: ["team-stats", team?.id],
    queryFn: async () => {
      if (!team) return null;
      const { data, error } = await supabase
        .rpc('get_team_prediction_stats', { team_id_param: team.id });
      if (error) throw error;
      return data[0];
    },
    enabled: !!team,
  });

  const { data: distribution } = useQuery({
    queryKey: ["team-distribution", team?.id],
    queryFn: async () => {
      if (!team) return null;
      const { data, error } = await supabase
        .rpc('get_team_result_distribution', { team_id_param: team.id });
      if (error) throw error;
      return data;
    },
    enabled: !!team,
  });

  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="flex items-center gap-4 pb-4">
          <img
            src={team.logo_url}
            alt={`${team.name} logo`}
            className="h-16 w-16 object-contain"
          />
          <h2 className="font-display text-2xl font-semibold">{team.name}</h2>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="patterns" className="flex-1">Prediction Patterns</TabsTrigger>
            <TabsTrigger value="predictors" className="flex-1">Top Predictors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <TeamOverview stats={stats} distribution={distribution} />
          </TabsContent>

          <TabsContent value="patterns">
            <TeamPredictionPatterns stats={stats} />
          </TabsContent>

          <TabsContent value="predictors">
            <TeamTopPredictors teamId={team.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}