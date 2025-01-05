export interface Prediction {
  id: string;
  user_id: string;
  game_id: string;
  prediction_home_score: number;
  prediction_away_score: number;
  points_earned: number | null;
  created_at: string;
  updated_at: string;
  game?: {
    id: string;
    game_date: string;
    home_team: {
      name: string;
    };
    away_team: {
      name: string;
    };
    game_results?: {
      home_score: number;
      away_score: number;
      is_final: boolean;
    };
  };
}