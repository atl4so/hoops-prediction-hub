import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { useRoundGames } from "@/hooks/useRoundGames";
import { RoundGameCard } from "@/components/games/stats/RoundGameCard";

export default function GameStats() {
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 34;
  const { schedules, results, loading, error } = useRoundGames(currentRound);

  useEffect(() => {
    const findLatestRoundWithResults = async () => {
      // Start from the latest round and work backwards
      for (let round = totalRounds; round >= 1; round--) {
        const gameNumbers = Array.from({ length: 8 }, (_, i) => ((round - 1) * 8 + 1) + i);
        let hasResults = false;

        // Check any game in the round for results
        for (const gameNumber of gameNumbers) {
          const resultsResponse = await fetch(
            `https://api-live.euroleague.net/v1/results?seasonCode=E2024&gameNumber=${gameNumber}`
          );
          
          if (!resultsResponse.ok) continue;
          
          const resultsXml = await resultsResponse.text();
          const parser = new XMLParser();
          const resultsData = parser.parse(resultsXml);
          
          if (resultsData.results?.game) {
            hasResults = true;
            break;
          }
        }

        if (hasResults) {
          setCurrentRound(round);
          break;
        }
      }
    };

    findLatestRoundWithResults();
  }, []);

  const handlePageChange = (round: number) => {
    if (round >= 1 && round <= totalRounds) {
      setCurrentRound(round);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <PageHeader title="Euroleague Game Stats" />
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <PageHeader title={`Euroleague Round ${currentRound}`} />
      
      <div className="space-y-4">
        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-[72px]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {schedules.map((game) => (
              <RoundGameCard
                key={game.game}
                game={game}
                result={results.find(r => r.gamecode === game.game)}
              />
            ))}
          </div>
        )}

        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentRound - 1)}
                  className={currentRound <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalRounds }, (_, i) => i + 1)
                .filter(round => {
                  const nearCurrent = Math.abs(round - currentRound) <= 1;
                  const isEndpoint = round === 1 || round === totalRounds;
                  return nearCurrent || isEndpoint;
                })
                .map((round, index, array) => {
                  const showEllipsis = index > 0 && array[index - 1] !== round - 1;
                  
                  return (
                    <PaginationItem key={round}>
                      {showEllipsis && <PaginationEllipsis />}
                      <PaginationLink
                        onClick={() => handlePageChange(round)}
                        isActive={currentRound === round}
                      >
                        {round}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentRound + 1)}
                  className={currentRound >= totalRounds ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}