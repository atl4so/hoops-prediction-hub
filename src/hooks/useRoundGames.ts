import { useState, useEffect } from "react";
import { XMLParser } from "fast-xml-parser";
import type { ScheduleItem, GameResult } from "@/types/euroleague-api";

export function useRoundGames(currentRound: number) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [results, setResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate game numbers for current round
  const getGameNumbersForRound = (round: number) => {
    const startGameNumber = (round - 1) * 8 + 1;
    return Array.from({ length: 8 }, (_, i) => startGameNumber + i);
  };

  useEffect(() => {
    const fetchRoundData = async () => {
      try {
        setLoading(true);
        const gameNumbers = getGameNumbersForRound(currentRound);
        
        const schedulePromises = gameNumbers.map(gameNumber =>
          fetch(`https://api-live.euroleague.net/v1/schedules?seasonCode=E2024&gameNumber=${gameNumber}`)
        );
        const resultPromises = gameNumbers.map(gameNumber =>
          fetch(`https://api-live.euroleague.net/v1/results?seasonCode=E2024&gameNumber=${gameNumber}`)
        );

        const [scheduleResponses, resultResponses] = await Promise.all([
          Promise.all(schedulePromises),
          Promise.all(resultPromises)
        ]);

        const parser = new XMLParser({ ignoreAttributes: false });
        
        // Process schedules
        let allSchedules: ScheduleItem[] = [];
        for (const response of scheduleResponses) {
          if (!response.ok) continue;
          const scheduleXml = await response.text();
          const scheduleData = parser.parse(scheduleXml);
          if (scheduleData.schedule?.item) {
            const items = Array.isArray(scheduleData.schedule.item) 
              ? scheduleData.schedule.item 
              : [scheduleData.schedule.item];
            allSchedules = [...allSchedules, ...items];
          }
        }

        // Process results
        let allResults: GameResult[] = [];
        for (const response of resultResponses) {
          if (!response.ok) continue;
          const resultsXml = await response.text();
          const resultsData = parser.parse(resultsXml);
          if (resultsData.results?.game) {
            const games = Array.isArray(resultsData.results.game)
              ? resultsData.results.game
              : [resultsData.results.game];
            allResults = [...allResults, ...games];
          }
        }

        setSchedules(allSchedules);
        setResults(allResults);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load game data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoundData();
  }, [currentRound]);

  return { schedules, results, loading, error };
}