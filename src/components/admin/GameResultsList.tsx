import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function GameResultsList() {
  const { data: existingResults } = useQuery({
    queryKey: ['game-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_results')
        .select(`
          *,
          game:games(
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey(name),
            away_team:teams!games_away_team_id_fkey(name)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Existing Results</h3>
      <div className="grid gap-4">
        {existingResults?.map((result) => (
          <div
            key={result.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(result.game.game_date), "PPP")}
              </p>
              <h4 className="font-medium">
                {result.game.home_team.name} {result.home_score} - {result.away_score} {result.game.away_team.name}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}