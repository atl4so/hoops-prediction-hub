import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamOverview } from "./details/TeamOverview";
import { TeamPredictionPatterns } from "./details/TeamPredictionPatterns";
import { TeamTopPredictors } from "./details/TeamTopPredictors";
import { supabase } from "@/integrations/supabase/client";
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
      <DialogContent className="max-w-2xl w-[95vw] h-[90vh] max-h-[90vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <div className="flex items-center gap-3 pb-4 border-b">
          <img
            src={team.logo_url}
            alt={`${team.name} logo`}
            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
          />
          <h2 className="font-display text-xl sm:text-2xl font-semibold truncate">{team.name}</h2>
        </div>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full grid grid-cols-3 h-auto p-1 mb-4">
            <TabsTrigger value="overview" className="text-sm sm:text-base py-2">Overview</TabsTrigger>
            <TabsTrigger value="patterns" className="text-sm sm:text-base py-2">Prediction Patterns</TabsTrigger>
            <TabsTrigger value="predictors" className="text-sm sm:text-base py-2">Top Predictors</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="overview" className="mt-0 h-full">
              <TeamOverview stats={stats} distribution={distribution} />
            </TabsContent>

            <TabsContent value="patterns" className="mt-0 h-full">
              <TeamPredictionPatterns stats={stats} />
            </TabsContent>

            <TabsContent value="predictors" className="mt-0 h-full">
              <TeamTopPredictors teamId={team.id} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}