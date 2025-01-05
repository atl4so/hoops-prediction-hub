export interface Game {
  id: string;
  round_id: string;
  home_team_id: string;
  away_team_id: string;
  game_date: string;
  created_at: string;
  updated_at: string;
  home_team?: {
    name: string;
    logo_url: string;
  };
  away_team?: {
    name: string;
    logo_url: string;
  };
  game_results?: {
    home_score: number;
    away_score: number;
    is_final: boolean;
  };
}