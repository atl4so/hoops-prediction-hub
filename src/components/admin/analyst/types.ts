export interface TeamBasicInfo {
  id: string;
  name: string;
}

export interface GamePrediction {
  prediction_home_score: number;
  prediction_away_score: number;
  points_earned: number | null;
  user: {
    display_name: string;
  };
}

export interface GameResult {
  home_score: number;
  away_score: number;
  is_final: boolean;
}

export interface Game {
  id: string;
  game_date: string;
  home_team: TeamBasicInfo;
  away_team: TeamBasicInfo;
  game_results: GameResult[];
  predictions?: GamePrediction[];
}

export interface Predictor {
  id: string;
  display_name: string;
  total_points: number;
  points_per_game: number;
  total_predictions: number;
  winner_predictions_correct: number;
  winner_predictions_total: number;
}

export interface TeamStats {
  total_games: number;
  total_predictions: number;
  overall_success_rate: number;
  home_success_rate: number;
  away_success_rate: number;
  underdog_wins: number;
  unexpected_losses: number;
  avg_upset_margin: number;
  avg_loss_margin: number;
  margin_1_9_wins: number;
  margin_10_15_wins: number;
  margin_15plus_wins: number;
  margin_1_9_losses: number;
  margin_10_15_losses: number;
  margin_15plus_losses: number;
  home_games: number;
  away_games: number;
  percentage_favoring_team: number;
  wins_predicted: number;
  losses_predicted: number;
}