import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import type { ScheduleItem, GameResult } from "@/types/euroleague-api";
import { XMLParser } from "fast-xml-parser";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

export default function GameStats() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [results, setResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 34;

  useEffect(() => {
    const findLatestRoundWithResults = async () => {
      try {
        // Start from the latest round and work backwards
        for (let round = totalRounds; round >= 1; round--) {
          const resultsResponse = await fetch(
            `https://api-live.euroleague.net/v1/results?seasonCode=E2024&gameNumber=${round}`
          );
          
          if (!resultsResponse.ok) continue;
          
          const resultsXml = await resultsResponse.text();
          const parser = new XMLParser();
          const resultsData = parser.parse(resultsXml);
          
          // Check if there are any results for this round
          if (resultsData.results?.game) {
            setCurrentRound(round);
            break;
          }
        }
      } catch (err) {
        console.error('Error finding latest round:', err);
      }
    };

    findLatestRoundWithResults();
  }, []);

  useEffect(() => {
    const fetchRoundData = async () => {
      try {
        setLoading(true);
        
        // Fetch schedule and results for current round only
        const [scheduleResponse, resultsResponse] = await Promise.all([
          fetch(`https://api-live.euroleague.net/v1/schedules?seasonCode=E2024&gameNumber=${currentRound}`),
          fetch(`https://api-live.euroleague.net/v1/results?seasonCode=E2024&gameNumber=${currentRound}`)
        ]);

        if (!scheduleResponse.ok || !resultsResponse.ok) {
          throw new Error('Failed to fetch round data');
        }

        const scheduleXml = await scheduleResponse.text();
        const resultsXml = await resultsResponse.text();

        const parser = new XMLParser({ ignoreAttributes: false });
        const scheduleData = parser.parse(scheduleXml);
        const resultsData = parser.parse(resultsXml);

        // Process schedule data
        let roundSchedule: ScheduleItem[] = [];
        if (scheduleData.schedule?.item) {
          roundSchedule = Array.isArray(scheduleData.schedule.item)
            ? scheduleData.schedule.item
            : [scheduleData.schedule.item];
        }

        // Process results data
        let roundResults: GameResult[] = [];
        if (resultsData.results?.game) {
          roundResults = Array.isArray(resultsData.results.game)
            ? resultsData.results.game
            : [resultsData.results.game];
        }

        // Sort games by date
        const sortedSchedule = roundSchedule.sort((a, b) => {
          const dateTimeA = `${a.date} ${a.startime}`;
          const dateTimeB = `${b.date} ${b.startime}`;
          const parsedA = parse(`${dateTimeA}`, 'MMM d, yyyy HH:mm', new Date());
          const parsedB = parse(`${dateTimeB}`, 'MMM d, yyyy HH:mm', new Date());
          return parsedB.getTime() - parsedA.getTime();
        });

        setSchedules(sortedSchedule);
        setResults(roundResults);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load game data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoundData();
  }, [currentRound]);

  const handleGameClick = (gameCode: string) => {
    navigate(`/game/${gameCode}`);
  };

  const handlePageChange = (round: number) => {
    if (round >= 1 && round <= totalRounds) {
      setCurrentRound(round);
    }
  };

  const truncateTeamName = (name: string) => {
    return name.length > 20 ? `${name.substring(0, 20)}...` : name;
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
      
      <div className="space-y-1">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : (
          schedules.map((game) => {
            const result = results.find(result => result.gamecode === game.gamecode);
            return (
              <Card 
                key={game.gamecode}
                className={cn(
                  "hover:shadow-md transition-shadow duration-200 cursor-pointer bg-card/50 border-border/50",
                  "overflow-hidden"
                )}
                onClick={() => handleGameClick(game.gamecode)}
              >
                <CardContent className="p-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <Badge 
                        variant="secondary" 
                        className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary text-[10px] px-1.5 py-0"
                      >
                        Round {game.game}
                      </Badge>
                      <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(game.date + ' ' + game.startime), 'MMM d, HH:mm')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate text-sm">
                          {truncateTeamName(game.hometeam)}
                        </h3>
                      </div>
                      
                      {result && (
                        <div className="flex items-center gap-2 px-2 flex-shrink-0">
                          <span className={cn(
                            "text-base font-bold tabular-nums",
                            result.homescore > result.awayscore ? "text-primary" : "text-muted-foreground"
                          )}>
                            {result.homescore}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">-</span>
                          <span className={cn(
                            "text-base font-bold tabular-nums",
                            result.awayscore > result.homescore ? "text-primary" : "text-muted-foreground"
                          )}>
                            {result.awayscore}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0 text-right">
                        <h3 className="font-medium truncate text-sm">
                          {truncateTeamName(game.awayteam)}
                        </h3>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

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
                // Show current round, first/last rounds, and rounds near current
                const nearCurrent = Math.abs(round - currentRound) <= 1;
                const isEndpoint = round === 1 || round === totalRounds;
                return nearCurrent || isEndpoint;
              })
              .map((round, index, array) => {
                // Add ellipsis between non-consecutive rounds
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
  );
}