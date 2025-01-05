import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamCard } from "./TeamCard";
import { TeamsListSkeleton } from "./TeamsListSkeleton";
import type { Team } from "@/types/supabase";

interface TeamsListProps {
  teams: Team[];
  isLoading: boolean;
  onTeamClick: (team: Team) => void;
  sortBy: "predictions" | "success" | "upsets" | "wins" | "losses";
}

export function TeamsList({ teams, isLoading, onTeamClick, sortBy }: TeamsListProps) {
  const { data: teamStats } = useQuery({
    queryKey: ["team-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_team_prediction_stats', { team_id_param: team.id });
        
      if (error) {
        console.error('Error fetching team stats:', error);
        throw error;
      }
      
      return { teamId: team.id, ...data[0] };
    },
    enabled: teams.length > 0,
  });

  if (isLoading) return <TeamsListSkeleton />;

  const sortedTeams = [...teams].sort((a, b) => {
    const statsA = teamStats?.find(s => s.teamId === a.id);
    const statsB = teamStats?.find(s => s.teamId === b.id);

    if (!statsA || !statsB) return 0;

    switch (sortBy) {
      case "predictions":
        return (statsB.total_predictions || 0) - (statsA.total_predictions || 0);
      case "success":
        return (statsB.overall_success_rate || 0) - (statsA.overall_success_rate || 0);
      case "upsets":
        return (statsB.underdog_wins || 0) - (statsA.underdog_wins || 0);
      case "wins":
        return (statsB.wins_predicted || 0) - (statsA.wins_predicted || 0);
      case "losses":
        return (statsB.losses_predicted || 0) - (statsA.losses_predicted || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sortedTeams.map((team, index) => {
        const stats = teamStats?.find(s => s.teamId === team.id);
        return (
          <TeamCard
            key={team.id}
            team={team}
            stats={stats}
            onClick={() => onTeamClick(team)}
            rank={index + 1}
            isLossesRanking={sortBy === "losses"}
          />
        );
      })}
    </div>
  );
}