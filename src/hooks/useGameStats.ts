import { useState, useEffect } from "react";
import { XMLParser } from "fast-xml-parser";

interface GameStats {
  localTeam: {
    name: string;
    score: number;
    stats: {
      fieldGoalsPercent: number;
      threePointsPercent: number;
      freeThrowsPercent: number;
      rebounds: number;
      assists: number;
      steals: number;
      blocks: number;
      turnovers: number;
    };
  };
  awayTeam: {
    name: string;
    score: number;
    stats: {
      fieldGoalsPercent: number;
      threePointsPercent: number;
      freeThrowsPercent: number;
      rebounds: number;
      assists: number;
      steals: number;
      blocks: number;
      turnovers: number;
    };
  };
}

export function useGameStats(gameCode: string | undefined) {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!gameCode) {
        setIsLoading(false);
        setError("No game code provided");
        return;
      }

      try {
        // Validate that gameCode is numeric
        if (!/^\d+$/.test(gameCode)) {
          throw new Error("Invalid game code format - must be numeric");
        }

        const response = await fetch(
          `https://api-live.euroleague.net/v1/games?seasonCode=E2024&gameCode=${gameCode}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch game stats: ${response.statusText}`);
        }

        const xmlText = await response.text();
        const parser = new XMLParser();
        const result = parser.parse(xmlText);
        const game = result.game;

        if (!game) {
          throw new Error("Invalid game data");
        }

        const localTeamTotals = game.localclub.totals.total;
        const awayTeamTotals = game.roadclub.totals.total;

        setStats({
          localTeam: {
            name: game.localclub.name,
            score: game.localclub.score,
            stats: {
              fieldGoalsPercent: parseFloat(localTeamTotals.FieldGoalsPercent) * 100,
              threePointsPercent: parseFloat(localTeamTotals.FieldGoals3Percent),
              freeThrowsPercent: parseFloat(localTeamTotals.FreeThrowsPercent),
              rebounds: localTeamTotals.TotalRebounds,
              assists: localTeamTotals.Assistances,
              steals: localTeamTotals.Steals,
              blocks: localTeamTotals.BlocksFavour,
              turnovers: localTeamTotals.Turnovers
            }
          },
          awayTeam: {
            name: game.roadclub.name,
            score: game.roadclub.score,
            stats: {
              fieldGoalsPercent: parseFloat(awayTeamTotals.FieldGoalsPercent) * 100,
              threePointsPercent: parseFloat(awayTeamTotals.FieldGoals3Percent),
              freeThrowsPercent: parseFloat(awayTeamTotals.FreeThrowsPercent),
              rebounds: awayTeamTotals.TotalRebounds,
              assists: awayTeamTotals.Assistances,
              steals: awayTeamTotals.Steals,
              blocks: awayTeamTotals.BlocksFavour,
              turnovers: awayTeamTotals.Turnovers
            }
          }
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching game stats:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch stats");
        setIsLoading(false);
      }
    };

    if (gameCode) {
      fetchStats();
    }
  }, [gameCode]);

  return { stats, isLoading, error };
}