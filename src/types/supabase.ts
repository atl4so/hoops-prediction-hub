export interface Team {
  id: string;
  name: string;
  logo_url: string;
}

export interface Round {
  id: string;
  name: string;
}

export interface GameResult {
  home_score: number;
  away_score: number;
  is_final: boolean;
}

export interface Game {
  id: string;
  game_date: string;
  parsedDate: Date;
  round: Round;
  home_team: Team;
  away_team: Team;
  game_results?: GameResult[];
}

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
  total_points?: number;
  points_per_game?: number;
  total_predictions?: number;
  highest_game_points?: number;
  lowest_game_points?: number;
  highest_round_points?: number;
  lowest_round_points?: number;
  winner_predictions_correct?: number;
  winner_predictions_total?: number;
  over_under_predictions_correct?: number;
  over_under_predictions_total?: number;
}

export interface RoundRank {
  rank: number;
  roundId: string;
  roundName: string;
  isCurrent: boolean;
}

export interface StatsListProps {
  totalPoints: number;
  pointsPerGame: number;
  totalPredictions: number;
  highestGamePoints?: number | null;
  lowestGamePoints?: number | null;
  highestRoundPoints?: number | null;
  lowestRoundPoints?: number | null;
  allTimeRank?: number | null;
  currentRoundRank?: { rank: number | null; isCurrent: boolean; roundName: string };
  winnerPredictionsCorrect?: number;
  winnerPredictionsTotal?: number;
  overUnderPredictionsCorrect?: number;
  overUnderPredictionsTotal?: number;
  userId?: string;
}

export interface Prediction {
  id: string;
  user: UserProfile;
  game: Game;
  prediction_home_score: number;
  prediction_away_score: number;
  points_earned?: number;
}

export interface UserPrediction {
  id: string;
  prediction: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  };
  game: Game;
}

export interface BackgroundSetting {
  id: string;
  url: string;
  opacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}