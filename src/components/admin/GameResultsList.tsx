import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Game } from "@/types/game";

export function GameResultsList() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("games")
        .select(`
          id,
          game_date,
          home_team:teams!games_home_team_id_fkey (
            name,
            logo_url
          ),
          away_team:teams!games_away_team_id_fkey (
            name,
            logo_url
          ),
          game_results!inner (
            home_score,
            away_score,
            is_final
          )
        `);

      if (error) {
        console.error("Error fetching games:", error);
      } else {
        setGames(data);
      }
      setLoading(false);
    };

    fetchGames();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Game Results</h2>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            {game.home_team.name} vs {game.away_team.name} - 
            {game.game_results[0].is_final ? (
              <>
                {" "}
                Final Score: {game.game_results[0].home_score} - {game.game_results[0].away_score}
              </>
            ) : (
              " Not Final"
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
