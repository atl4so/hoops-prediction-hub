import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { TeamDisplay } from "@/components/games/TeamDisplay";

interface TeamPredictionStats {
  team_id: string;
  team_name: string;
  logo_url: string;
  success_rate: number;
  total_predictions: number;
  correct_predictions: number;
}

export function BestTeamsPredictions({ userId }: { userId: string }) {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();

  const { data: bestTeams, isLoading } = useQuery({
    queryKey: ['userBestTeams', userId],
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
        .gt('wins_predicted', 0)
        .gt('wins_correct', 0); // Only show teams with at least 1 correct prediction

      if (error) {
        console.error('Error fetching team stats:', error);
        return [];
      }

      if (!teamStats) return [];

      const processedStats: TeamPredictionStats[] = teamStats
        .map(stat => ({
          team_id: stat.team_id,
          team_name: stat.team.name,
          logo_url: stat.team.logo_url,
          success_rate: stat.wins_predicted > 0 
            ? (stat.wins_correct / stat.wins_predicted) * 100 
            : 0,
          total_predictions: stat.wins_predicted,
          correct_predictions: stat.wins_correct
        }))
        .filter(stat => stat.correct_predictions > 0) // Only include teams with correct predictions
        .sort((a, b) => b.success_rate - a.success_rate || b.total_predictions - a.total_predictions)
        .slice(0, 3);

      console.log('Best teams calculated:', processedStats);
      return processedStats;
    },
    enabled: !!userId && !!session
  });

  if (isLoading || !bestTeams?.length) return null;

  return (
    <Card className="bg-accent/5">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-4 w-4 text-primary" />
          Best Teams
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="grid grid-cols-3 gap-2">
          {bestTeams?.map((team, index) => (
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
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs sm:text-sm">
                  {index + 1}
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">
                  {Math.round(team.success_rate)}%
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {team.correct_predictions} correct
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}