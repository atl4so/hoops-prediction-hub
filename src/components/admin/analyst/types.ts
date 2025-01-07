export interface GameResult {
  home_score: number;
  away_score: number;
  game: {
    id: string;
    home_team: { name: string };
    away_team: { name: string };
  };
}

export interface DatabaseContext {
  schema: string;
  summary: string;
}