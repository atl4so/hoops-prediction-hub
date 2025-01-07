import { supabase } from "@/integrations/supabase/client";

export async function fetchDatabaseSchema() {
  // Fetch upcoming games (games without results)
  const upcomingGames = await supabase
    .from('games')
    .select(`
      id,
      game_date,
      home_team:teams!games_home_team_id_fkey (
        id,
        name
      ),
      away_team:teams!games_away_team_id_fkey (
        id,
        name
      )
    `)
    .not(
      'id', 'in',
      supabase
        .from('game_results')
        .select('game_id')
    )
    .order('game_date', { ascending: true })
    .limit(5);

  // Fetch recent completed games with results and predictions
  const completedGames = await supabase
    .from('games')
    .select(`
      id,
      game_date,
      home_team:teams!games_home_team_id_fkey (
        id,
        name
      ),
      away_team:teams!games_away_team_id_fkey (
        id,
        name
      ),
      game_results (
        home_score,
        away_score,
        is_final
      ),
      predictions (
        prediction_home_score,
        prediction_away_score,
        points_earned,
        user:profiles (
          display_name
        )
      )
    `)
    .eq('game_results.is_final', true)
    .order('game_date', { ascending: false })
    .limit(5);

  // Fetch top predictors
  const topPredictors = await supabase
    .from('profiles')
    .select(`
      id,
      display_name,
      total_points,
      points_per_game,
      total_predictions,
      winner_predictions_correct,
      winner_predictions_total
    `)
    .order('points_per_game', { ascending: false })
    .limit(5);

  return {
    upcomingGames: upcomingGames.data || [],
    completedGames: completedGames.data || [],
    topPredictors: topPredictors.data || []
  };
}

export async function analyzeGameTrends(gameId: string) {
  const { data: gameData } = await supabase
    .from('games')
    .select(`
      id,
      game_date,
      home_team:teams!games_home_team_id_fkey (
        id,
        name
      ),
      away_team:teams!games_away_team_id_fkey (
        id,
        name
      ),
      game_results (
        home_score,
        away_score,
        is_final
      ),
      predictions (
        prediction_home_score,
        prediction_away_score,
        points_earned,
        user:profiles (
          display_name,
          points_per_game
        )
      )
    `)
    .eq('id', gameId)
    .single();

  return gameData;
}

export async function getTeamStats(teamId: string) {
  const { data: teamStats } = await supabase
    .rpc('get_team_prediction_stats', { team_id_param: teamId });

  return teamStats?.[0];
}