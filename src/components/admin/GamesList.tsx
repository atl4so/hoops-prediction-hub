import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function GamesList() {
  const { data: games, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          home_team:teams!games_home_team_id_fkey(name),
          away_team:teams!games_away_team_id_fkey(name),
          round:rounds(name)
        `)
        .order('game_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Existing Games</h3>
      <div className="grid gap-4">
        {games?.map((game) => (
          <div
            key={game.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <p className="text-sm text-muted-foreground">{game.round.name}</p>
              <h4 className="font-medium">
                {game.home_team.name} vs {game.away_team.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {format(new Date(game.game_date), "PPP p")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}