export interface PredictionData {
  id: string;
  prediction_home_score: number;
  prediction_away_score: number;
  game: {
    id: string;
    game_date: string;
    home_team: {
      name: string;
    };
    away_team: {
      name: string;
    };
    game_results: Array<{
      home_score: number;
      away_score: number;
      is_final: boolean;
    }>;
  };
}