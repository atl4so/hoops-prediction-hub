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

export default function GameStats() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [results, setResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all rounds from 1 to current
        const roundPromises = Array.from({ length: 34 }, (_, i) => i + 1).map(round =>
          fetch(`https://api-live.euroleague.net/v1/schedules?seasonCode=E2024&gameNumber=${round}`)
            .then(res => res.ok ? res.text() : Promise.reject(`Failed to fetch round ${round}`))
        );

        const resultsPromises = Array.from({ length: 34 }, (_, i) => i + 1).map(round =>
          fetch(`https://api-live.euroleague.net/v1/results?seasonCode=E2024&gameNumber=${round}`)
            .then(res => res.ok ? res.text() : Promise.reject(`Failed to fetch results for round ${round}`))
        );

        const [scheduleResponses, resultsResponses] = await Promise.all([
          Promise.all(roundPromises),
          Promise.all(resultsPromises)
        ]);

        const parser = new XMLParser({ ignoreAttributes: false });
        let allSchedules: ScheduleItem[] = [];
        let allResults: GameResult[] = [];

        scheduleResponses.forEach(scheduleXml => {
          const scheduleData = parser.parse(scheduleXml);
          if (scheduleData.schedule?.item) {
            const items = Array.isArray(scheduleData.schedule.item) 
              ? scheduleData.schedule.item 
              : [scheduleData.schedule.item];
            allSchedules = [...allSchedules, ...items];
          }
        });

        resultsResponses.forEach(resultsXml => {
          const resultsData = parser.parse(resultsXml);
          if (resultsData.results?.game) {
            const games = Array.isArray(resultsData.results.game)
              ? resultsData.results.game
              : [resultsData.results.game];
            allResults = [...allResults, ...games];
          }
        });

        // Sort all games by date, most recent first
        const sortedSchedules = allSchedules.sort((a, b) => {
          const dateTimeA = `${a.date} ${a.startime}`;
          const dateTimeB = `${b.date} ${b.startime}`;
          const parsedA = parse(`${dateTimeA}`, 'MMM d, yyyy HH:mm', new Date());
          const parsedB = parse(`${dateTimeB}`, 'MMM d, yyyy HH:mm', new Date());
          return parsedB.getTime() - parsedA.getTime();
        });

        setSchedules(sortedSchedules);
        setResults(allResults);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load game data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGameResult = (gameCode: string) => {
    return results.find(result => result.gamecode === gameCode);
  };

  const handleGameClick = (gameCode: string) => {
    navigate(`/game/${gameCode}`);
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
      <PageHeader title="Euroleague Game Stats" />
      
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
            const result = getGameResult(game.gamecode);
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
                        Round {game.gamenumber}
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
    </div>
  );
}