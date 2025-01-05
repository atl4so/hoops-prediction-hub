export interface PredictionData {
  id: string;
  game: {
    home_team: {
      name: string;
    };
    away_team: {
      name: string;
    };
    game_results: {
      home_score: number;
      away_score: number;
    }[];
  };
  prediction: {
    prediction_home_score: number;
    prediction_away_score: number;
  };
}