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
  highestGamePoints?: number;
  lowestGamePoints?: number;
  highestRoundPoints?: number;
  lowestRoundPoints?: number;
  allTimeRank?: number;
  currentRoundRank?: RoundRank;
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