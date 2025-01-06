import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface GameResult {
  home_score: number;
  away_score: number;
  is_final: boolean;
}

interface LastGameResult {
  home_score: number;
  away_score: number;
  is_home: boolean;
  game_date: string;
}

export interface GameInsights {
  totalPredictions: number;
  homeWinPredictions: number;
  awayWinPredictions: number;
  avgHomeScore: number;
  avgAwayScore: number;
  marginRange: string;
  totalPointsRange: string;
  lastGameResult?: LastGameResult;
  gameResult?: GameResult;
}

interface RawGameInsights {
  total_predictions: number;
  home_win_predictions: number;
  away_win_predictions: number;
  avg_home_score: number;
  avg_away_score: number;
  common_margin_range: string;
  common_total_points_range: string;
  last_game_result: Json;
  game_result: Json;
}

function parseGameResult(json: Json): GameResult | null {
  if (!json || typeof json !== 'object') return null;
  const obj = json as Record<string, unknown>;
  
  if (
    typeof obj.home_score === 'number' &&
    typeof obj.away_score === 'number' &&
    typeof obj.is_final === 'boolean'
  ) {
    return {
      home_score: obj.home_score,
      away_score: obj.away_score,
      is_final: obj.is_final
    };
  }
  return null;
}

function parseLastGameResult(json: Json): LastGameResult | null {
  if (!json || typeof json !== 'object') return null;
  const obj = json as Record<string, unknown>;
  
  if (
    typeof obj.home_score === 'number' &&
    typeof obj.away_score === 'number' &&
    typeof obj.is_home === 'boolean' &&
    typeof obj.game_date === 'string'
  ) {
    return {
      home_score: obj.home_score,
      away_score: obj.away_score,
      is_home: obj.is_home,
      game_date: obj.game_date
    };
  }
  return null;
}

export function useGameInsights(gameId: string) {
  return useQuery({
    queryKey: ['gameInsights', gameId],
    queryFn: async (): Promise<GameInsights | null> => {
      const { data, error } = await supabase
        .rpc('get_game_prediction_insights', {
          game_id_param: gameId
        });

      if (error) {
        console.error('Error fetching game insights:', error);
        throw error;
      }

      if (!data?.[0]) return null;

      const result = data[0] as RawGameInsights;
      
      return {
        totalPredictions: Number(result.total_predictions),
        homeWinPredictions: Number(result.home_win_predictions),
        awayWinPredictions: Number(result.away_win_predictions),
        avgHomeScore: Number(result.avg_home_score),
        avgAwayScore: Number(result.avg_away_score),
        marginRange: result.common_margin_range,
        totalPointsRange: result.common_total_points_range,
        lastGameResult: parseLastGameResult(result.last_game_result) || undefined,
        gameResult: parseGameResult(result.game_result) || undefined
      };
    }
  });
}