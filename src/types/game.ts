import type { Database } from "@/integrations/supabase/types";

export type Game = Database["public"]["Tables"]["games"]["Row"] & {
  home_team: {
    name: string;
    logo_url: string;
  };
  away_team: {
    name: string;
    logo_url: string;
  };
  game_results?: {
    home_score: number;
    away_score: number;
    is_final: boolean;
  }[];
};

export type GameResult = Database["public"]["Tables"]["game_results"]["Row"];