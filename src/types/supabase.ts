export interface Game {
  id: string;
  game_date: string;
  round: {
    id: string;
    name: string;
  };
  home_team: {
    id: string;
    name: string;
    logo_url: string;
  };
  away_team: {
    id: string;
    name: string;
    logo_url: string;
  };
  game_results?: Array<{
    home_score: number;
    away_score: number;
    is_final: boolean;
  }>;
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
  userId: string;
}