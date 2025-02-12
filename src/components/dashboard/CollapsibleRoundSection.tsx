import { UserPredictionCard } from "./UserPredictionCard";
import { DownloadPredictionsButton } from "./DownloadPredictionsButton";
import { GameCard } from "../games/GameCard";
import { RoundSummaryDialog } from "./predictions/RoundSummaryDialog";
import { Button } from "../ui/button";
import { Share2 } from "lucide-react";

interface Game {
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

interface Prediction {
  prediction_home_score: number;
  prediction_away_score: number;
  points_earned?: number;
}

interface CollapsibleRoundSectionProps {
  roundId: string;
  roundName: string;
  predictions: Array<{
    id: string;
    game: Game;
    prediction: Prediction | null;
  }>;
  userName: string;
  showGames?: boolean;
}

export function CollapsibleRoundSection({
  predictions,
  roundName,
  userName,
  showGames = false,
}: CollapsibleRoundSectionProps) {
  if (!predictions?.length) {
    return null;
  }

  // Group predictions by round
  const predictionsByRound = predictions.reduce((acc, prediction) => {
    if (!prediction.game?.round) return acc;
    
    const roundId = prediction.game.round.id;
    const roundName = prediction.game.round.name;
    
    if (!acc[roundId]) {
      acc[roundId] = {
        roundName,
        predictions: []
      };
    }
    
    acc[roundId].predictions.push(prediction);
    return acc;
  }, {} as Record<string, { roundName: string; predictions: typeof predictions }>);

  // Sort predictions within each round
  Object.values(predictionsByRound).forEach(round => {
    round.predictions.sort((a, b) => {
      const aResults = a.game.game_results || [];
      const bResults = b.game.game_results || [];
      
      const aFinished = aResults.some(result => result.is_final) ?? false;
      const bFinished = bResults.some(result => result.is_final) ?? false;
      
      // If one is finished and the other isn't, put unfinished first
      if (aFinished !== bFinished) {
        return aFinished ? 1 : -1;
      }
      
      // Sort unfinished games by date ascending (earliest first)
      // Sort finished games by date descending (latest first)
      const timeA = new Date(a.game.game_date).getTime();
      const timeB = new Date(b.game.game_date).getTime();
      return aFinished 
        ? timeB - timeA  // For finished games, sort descending (newest first)
        : timeA - timeB; // For unfinished games, sort ascending (earliest first)
    });
  });

  // Check if all games in the round are finished
  const isRoundFinished = (roundPredictions: typeof predictions) => {
    return roundPredictions.every(prediction => 
      prediction.game.game_results?.some(result => result.is_final)
    );
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] space-y-8">
      {Object.entries(predictionsByRound).map(([roundId, { roundName, predictions: roundPredictions }]) => (
        <div key={roundId} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold tracking-tight">Round {roundName}</h3>
            
            {!showGames && (
              <div className="flex items-center gap-2">
                {isRoundFinished(roundPredictions) && (
                  <RoundSummaryDialog
                    roundName={roundName}
                    userName={userName}
                    predictions={roundPredictions}
                  />
                )}
              </div>
            )}
          </div>
          
          <div className="grid gap-4 md:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {roundPredictions.map((prediction) => (
              showGames ? (
                <GameCard
                  key={prediction.id}
                  game={prediction.game}
                  isAuthenticated={true}
                  prediction={prediction.prediction}
                />
              ) : (
                prediction.prediction && (
                  <UserPredictionCard
                    key={prediction.id}
                    game={{
                      ...prediction.game,
                      game_results: prediction.game.game_results || []
                    }}
                    prediction={prediction.prediction}
                    isOwnPrediction={true}
                  />
                )
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}