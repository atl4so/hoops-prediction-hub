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
}

export function BestTeamsPredictions({ userId }: { userId: string }) {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();

  const { data: bestTeams, isLoading } = useQuery({
    queryKey: ['userBestTeams', userId],
    queryFn: async () => {
      const { data: predictions } = await supabase
        .from('predictions')
        .select(`
          points_earned,
          game:games (
            home_team_id,
            away_team_id,
            home_team:teams!games_home_team_id_fkey (
              id,
              name,
              logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
              id,
              name,
              logo_url
            )
          )
        `)
        .eq('user_id', userId)
        .not('points_earned', 'is', null);

      if (!predictions) return [];

      const teamStats = new Map<string, { success: number; total: number; name: string; logo_url: string }>();

      predictions.forEach(prediction => {
        if (!prediction.game) return;
        
        const homeTeam = prediction.game.home_team;
        const awayTeam = prediction.game.away_team;
        
        if (!homeTeam || !awayTeam) return;

        // Process home team stats
        if (!teamStats.has(homeTeam.id)) {
          teamStats.set(homeTeam.id, { 
            success: 0, 
            total: 0, 
            name: homeTeam.name, 
            logo_url: homeTeam.logo_url 
          });
        }
        const homeStats = teamStats.get(homeTeam.id)!;
        homeStats.total++;
        if (prediction.points_earned > 0) homeStats.success++;

        // Process away team stats
        if (!teamStats.has(awayTeam.id)) {
          teamStats.set(awayTeam.id, { 
            success: 0, 
            total: 0, 
            name: awayTeam.name, 
            logo_url: awayTeam.logo_url 
          });
        }
        const awayStats = teamStats.get(awayTeam.id)!;
        awayStats.total++;
        if (prediction.points_earned > 0) awayStats.success++;
      });

      // Convert to array and calculate success rates
      const teamsArray: TeamPredictionStats[] = Array.from(teamStats.entries())
        .map(([team_id, stats]) => ({
          team_id,
          team_name: stats.name,
          logo_url: stats.logo_url,
          success_rate: (stats.success / stats.total) * 100,
          total_predictions: stats.total
        }))
        .filter(team => team.total_predictions >= 1) // Changed from 3 to 1
        .sort((a, b) => b.success_rate - a.success_rate)
        .slice(0, 3); // Get top 3 teams

      return teamsArray;
    },
    enabled: !!userId && !!session
  });

  if (isLoading || !bestTeams?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Your Best Teams
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {bestTeams.map((team, index) => (
            <div 
              key={team.team_id}
              className="flex flex-col items-center p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
            >
              <div className="relative">
                <TeamDisplay
                  team={{
                    name: team.team_name,
                    logo_url: team.logo_url
                  }}
                  imageClassName="w-20 h-20"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="font-semibold text-lg">{team.team_name}</p>
                <p className="text-sm text-muted-foreground">
                  Success rate: {team.success_rate.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {team.total_predictions} predictions
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}