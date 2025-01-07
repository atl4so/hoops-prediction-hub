import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchDatabaseSchema, analyzeGameTrends, getTeamStats } from "./useAnalystData";
import type { Game, Predictor } from "./types";

export function BasketballAnalyst() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const { data: schemaData, isLoading } = useQuery({
    queryKey: ["analyst-data"],
    queryFn: fetchDatabaseSchema
  });

  const { data: selectedGameData } = useQuery({
    queryKey: ["game-analysis", selectedGameId],
    queryFn: () => selectedGameId ? analyzeGameTrends(selectedGameId) : null,
    enabled: !!selectedGameId
  });

  if (isLoading) {
    return <div>Loading analysis...</div>;
  }

  const { upcomingGames, completedGames, topPredictors } = schemaData || {};

  const generateAnalysis = () => {
    let analysis = "Based on the database analysis:\n\n";

    // Analyze upcoming games
    if (upcomingGames?.length) {
      analysis += "Upcoming Games:\n";
      upcomingGames.forEach((game: Game) => {
        analysis += `- ${game.home_team.name} vs ${game.away_team.name} on ${new Date(game.game_date).toLocaleDateString()}\n`;
      });
    }

    // Analyze completed games
    if (completedGames?.length) {
      analysis += "\nRecent Results:\n";
      completedGames.forEach((game: Game) => {
        const result = game.game_results?.[0];
        if (result) {
          analysis += `- ${game.home_team.name} ${result.home_score} - ${result.away_score} ${game.away_team.name}\n`;
          if (game.predictions && game.predictions.length > 0) {
            const avgPoints = game.predictions.reduce((sum, p) => sum + (p.points_earned || 0), 0) / game.predictions.length;
            analysis += `  Average prediction points: ${avgPoints.toFixed(1)}\n`;
          }
        }
      });
    }

    // Analyze top predictors
    if (topPredictors?.length) {
      analysis += "\nTop Predictors:\n";
      topPredictors.forEach((predictor: Predictor) => {
        const winRate = (predictor.winner_predictions_correct / predictor.winner_predictions_total * 100).toFixed(1);
        analysis += `- ${predictor.display_name}: ${predictor.points_per_game.toFixed(1)} PPG, ${winRate}% winner accuracy\n`;
      });
    }

    return analysis;
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Basketball Analyst</h2>
      <pre className="whitespace-pre-wrap font-mono text-sm">
        {generateAnalysis()}
      </pre>
    </Card>
  );
}