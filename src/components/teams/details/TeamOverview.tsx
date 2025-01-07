import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamPredictionPatterns } from "./TeamPredictionPatterns";
import { TeamTopPredictors } from "./TeamTopPredictors";
import { BestTeamsPredictions } from "./BestTeamsPredictions";

export function TeamOverview() {
  const { teamId } = useParams();

  const { data: bestTeams } = useQuery({
    queryKey: ['best-teams-predictions', teamId],
    queryFn: async () => {
      console.log('Fetching best teams predictions...');
      const { data: teams, error } = await supabase
        .rpc('get_team_top_predictors', { 
          team_id_param: teamId,
          min_games: 3 
        });

      if (error) {
        console.error('Error fetching best teams:', error);
        throw error;
      }

      return teams.map(team => ({
        team: {
          name: team.display_name,
          logo_url: team.avatar_url
        },
        success_rate: Number(team.success_rate),
        total_predictions: Number(team.total_predictions)
      })).slice(0, 3);
    },
    enabled: !!teamId
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <BestTeamsPredictions teams={bestTeams || []} />
      <TeamPredictionPatterns />
      <TeamTopPredictors />
    </div>
  );
}