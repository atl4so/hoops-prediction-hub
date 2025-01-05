import type { Database } from "@/integrations/supabase/types";

export type Prediction = Database["public"]["Tables"]["predictions"]["Row"] & {
  game?: {
    id: string;
    game_date: string;
    home_team: {
      name: string;
    };
    away_team: {
      name: string;
    };
    game_results: {
      home_score: number;
      away_score: number;
      is_final: boolean;
    }[];
  };
};