import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skull } from "lucide-react";
import { TeamDisplay } from "@/components/games/TeamDisplay";

interface TeamPredictionStats {
  team_id: string;
  team_name: string;
  logo_url: string;
  failure_rate: number;
  total_predictions: number;
  incorrect_predictions: number;
}

export function WorstTeamsPredictions({ userId }: { userId: string }) {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();

  const { data: worstTeams, isLoading } = useQuery({
    queryKey: ['userWorstTeams', userId],
    queryFn: async () => {
      const { data: teamStats, error } = await supabase
        .from('team_prediction_stats')
        .select(`
          team_id,
          wins_predicted,
          wins_correct,
          team:teams!team_prediction_stats_team_id_fkey (
            name,
            logo_url
          )
        `)
        .eq('user_id', userId)
        .gt('wins_predicted', 0);

      if (error) {
        console.error('Error fetching team stats:', error);
        return [];
      }

      if (!teamStats) return [];

      const processedStats: TeamPredictionStats[] = teamStats
        .map(stat => {
          const incorrect = stat.wins_predicted - stat.wins_correct;
          return {
            team_id: stat.team_id,
            team_name: stat.team.name,
            logo_url: stat.team.logo_url,
            failure_rate: stat.wins_predicted > 0 
              ? (incorrect / stat.wins_predicted) * 100 
              : 0,
            total_predictions: stat.wins_predicted,
            incorrect_predictions: incorrect
          };
        })
        .filter(stat => stat.incorrect_predictions > 0) // Only include teams with incorrect predictions
        .sort((a, b) => b.failure_rate - a.failure_rate || b.total_predictions - a.total_predictions)
        .slice(0, 3);

      console.log('Worst teams calculated:', processedStats);
      return processedStats;
    },
    enabled: !!userId && !!session
  });

  if (isLoading || !worstTeams?.length) return null;

  return (
    <Card className="bg-accent/5">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Skull className="h-4 w-4 text-destructive" />
          Your Worst Teams
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="grid grid-cols-3 gap-2">
          {worstTeams?.map((team, index) => (
            <div 
              key={team.team_id}
              className="flex flex-col items-center p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
            >
              <div className="relative">
                <TeamDisplay
                  team={{
                    name: team.team_name,
                    logo_url: team.logo_url
                  }}
                  imageClassName="w-12 h-12 sm:w-16 sm:h-16"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground font-bold text-xs sm:text-sm">
                  {index + 1}
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">
                  {Math.round(team.failure_rate)}%
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {team.total_predictions} pred.
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}