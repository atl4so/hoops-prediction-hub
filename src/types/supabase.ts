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
  round: Round;
  home_team: Team;
  away_team: Team;
  game_results?: GameResult[];
}

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
}

export interface Prediction {
  id: string;
  user: UserProfile;
  game: Game;
  prediction_home_score: number;
  prediction_away_score: number;
  points_earned?: number;
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
  currentRoundRank?: RoundRank;
  userId: string | null;
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

export interface GameWithPrediction extends Game {
  prediction?: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  };
}