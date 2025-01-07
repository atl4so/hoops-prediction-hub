import { supabase } from "@/integrations/supabase/client";
import { GameResult } from "./types";

export const fetchDatabaseContext = async () => {
  // Get database statistics
  const [
    { count: gamesCount },
    { count: predictionsCount },
    { count: resultsCount },
    { count: roundsCount }
  ] = await Promise.all([
    supabase.from('games').select('*', { count: 'exact', head: true }),
    supabase.from('predictions').select('*', { count: 'exact', head: true }),
    supabase.from('game_results').select('*', { count: 'exact', head: true }),
    supabase.from('rounds').select('*', { count: 'exact', head: true })
  ]);

  // Get upcoming games (games without results)
  const upcomingGamesQuery = supabase
    .from('game_results')
    .select('game_id');

  const { data: upcomingGames } = await supabase
    .from('games')
    .select(`
      id,
      game_date,
      home_team:teams!games_home_team_id_fkey (name),
      away_team:teams!games_away_team_id_fkey (name)
    `)
    .not('id', 'in', upcomingGamesQuery)
    .order('game_date', { ascending: true })
    .limit(5);

  // Get recent completed games with results
  const { data: recentResults } = await supabase
    .from('game_results')
    .select(`
      home_score,
      away_score,
      game:games (
        id,
        home_team:teams!games_home_team_id_fkey (name),
        away_team:teams!games_away_team_id_fkey (name)
      )
    `)
    .eq('is_final', true)
    .order('created_at', { ascending: false })
    .limit(5) as { data: GameResult[] | null };

  // Get predictions for completed games
  const predictionsData = recentResults ? await Promise.all(
    recentResults.map(async (result) => {
      const { data: predictions } = await supabase
        .from('predictions')
        .select('points_earned')
        .eq('game_id', result.game.id);
      return {
        gameId: result.game.id,
        predictions: predictions || []
      };
    })
  ) : [];

  // Get top predictors
  const { data: topPredictors } = await supabase
    .from('profiles')
    .select('display_name, total_points, points_per_game')
    .order('total_points', { ascending: false })
    .limit(5);

  return {
    schema: `
      Database Overview:
      - ${gamesCount} total games
      - ${resultsCount} completed games with results
      - ${gamesCount - resultsCount} upcoming games
      - ${predictionsCount} total predictions
      - ${roundsCount} rounds
    `,
    summary: `
      Upcoming Games:
      ${upcomingGames?.map(g => 
        `${g.home_team.name} vs ${g.away_team.name} (${new Date(g.game_date).toLocaleDateString()})`
      ).join('\n')}

      Recent Completed Games:
      ${recentResults?.map((r, index) => {
        const gamePredictions = predictionsData[index]?.predictions || [];
        const predictionCount = gamePredictions.length;
        const avgPoints = predictionCount > 0 
          ? gamePredictions.reduce((sum, p) => sum + (p.points_earned || 0), 0) / predictionCount 
          : 0;
        return `${r.game.home_team.name} ${r.home_score} - ${r.away_score} ${r.game.away_team.name} (${predictionCount} predictions, avg ${avgPoints.toFixed(1)} points)`;
      }).join('\n')}

      Top Predictors:
      ${topPredictors?.map(p => 
        `${p.display_name}: ${p.total_points} points (${p.points_per_game.toFixed(1)} PPG)`
      ).join('\n')}
    `
  };
};