import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PredictionsByRound {
  [key: string]: {
    roundId: string;
    roundName: string;
    predictions: Array<{
      id: string;
      game: {
        id: string;
        game_date: string;
        home_team: {
          name: string;
          logo_url: string;
        };
        away_team: {
          name: string;
          logo_url: string;
        };
        game_results: Array<{
          home_score: number;
          away_score: number;
          is_final: boolean;
        }>;
      };
      prediction: {
        prediction_home_score: number;
        prediction_away_score: number;
        points_earned?: number;
      };
    }>;
  };
}

export function useUserPredictions(userId: string | undefined) {
  const { data: predictions, isLoading } = useQuery({
    queryKey: ["predictions", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("predictions")
        .select(`
          id,
          prediction_home_score,
          prediction_away_score,
          points_earned,
          game:games (
            id,
            game_date,
            round:rounds (
              id,
              name
            ),
            home_team:teams!games_home_team_id_fkey (
              id,
              name,
              logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
              id,
              name,
              logo_url
            ),
            game_results (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching predictions:", error);
        return [];
      }

      return data;
    },
    enabled: !!userId,
  });

  // Transform predictions into grouped format
  const predictionsByRound = predictions?.reduce((acc: PredictionsByRound, pred) => {
    const roundId = pred.game.round.id;
    const roundName = pred.game.round.name;
    
    if (!acc[roundId]) {
      acc[roundId] = {
        roundId,
        roundName,
        predictions: []
      };
    }
    
    acc[roundId].predictions.push({
      id: pred.id,
      game: {
        id: pred.game.id,
        game_date: pred.game.game_date,
        home_team: {
          name: pred.game.home_team.name,
          logo_url: pred.game.home_team.logo_url
        },
        away_team: {
          name: pred.game.away_team.name,
          logo_url: pred.game.away_team.logo_url
        },
        game_results: Array.isArray(pred.game.game_results) ? pred.game.game_results : []
      },
      prediction: {
        prediction_home_score: pred.prediction_home_score,
        prediction_away_score: pred.prediction_away_score,
        points_earned: pred.points_earned
      }
    });
    
    return acc;
  }, {});

  return {
    predictionsByRound: predictionsByRound || {},
    isLoading
  };
}