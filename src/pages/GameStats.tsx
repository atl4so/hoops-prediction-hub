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
        const scheduleResponse = await fetch(
          "https://api-live.euroleague.net/v1/schedules?seasonCode=E2024&gameNumber=22"
        );
        
        if (!scheduleResponse.ok) {
          throw new Error('Failed to fetch schedules');
        }

        const resultsResponse = await fetch(
          "https://api-live.euroleague.net/v1/results?seasonCode=E2024&gameNumber=22"
        );

        if (!resultsResponse.ok) {
          throw new Error('Failed to fetch results');
        }

        const scheduleXml = await scheduleResponse.text();
        const resultsXml = await resultsResponse.text();
        const parser = new XMLParser({ ignoreAttributes: false });
        
        const scheduleData = parser.parse(scheduleXml);
        const resultsData = parser.parse(resultsXml);
        
        if (scheduleData.schedule?.item) {
          const items = Array.isArray(scheduleData.schedule.item) 
            ? scheduleData.schedule.item 
            : [scheduleData.schedule.item];

          const sortedItems = items.sort((a, b) => {
            const dateTimeA = `${a.date} ${a.startime}`;
            const dateTimeB = `${b.date} ${b.startime}`;
            const parsedA = parse(`${dateTimeA}`, 'MMM d, yyyy HH:mm', new Date());
            const parsedB = parse(`${dateTimeB}`, 'MMM d, yyyy HH:mm', new Date());
            return parsedB.getTime() - parsedA.getTime();
          });

          setSchedules(sortedItems);
        }

        if (resultsData.results?.game) {
          const games = Array.isArray(resultsData.results.game)
            ? resultsData.results.game
            : [resultsData.results.game];

          setResults(games);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load game data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatGameDate = (dateStr: string, timeStr: string) => {
    try {
      const date = parse(dateStr, 'MMM d, yyyy', new Date());
      return format(date, 'MMM d, yyyy') + ' at ' + timeStr;
    } catch (err) {
      return dateStr + ' at ' + timeStr;
    }
  };

  const getGameResult = (gameCode: string) => {
    return results.find(result => result.gamecode === gameCode);
  };

  const handleGameClick = (gameCode: string) => {
    navigate(`/game/${gameCode}`);
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
      
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
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
                  "hover:shadow-md transition-shadow duration-200 cursor-pointer bg-card",
                  "border-border/50"
                )}
                onClick={() => handleGameClick(game.gamecode)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {/* Status and Date */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <Badge 
                        variant="secondary" 
                        className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary"
                      >
                        FINAL
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(game.date + ' ' + game.startime), 'MMM d, HH:mm')}</span>
                      </div>
                    </div>

                    {/* Teams and Score */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg truncate">{game.hometeam}</h3>
                      </div>
                      
                      {result && (
                        <div className="flex items-center gap-3 px-3">
                          <span className={cn(
                            "text-2xl font-bold tabular-nums",
                            result.homescore > result.awayscore ? "text-primary" : "text-muted-foreground"
                          )}>
                            {result.homescore}
                          </span>
                          <span className="text-sm font-medium text-muted-foreground">vs</span>
                          <span className={cn(
                            "text-2xl font-bold tabular-nums",
                            result.awayscore > result.homescore ? "text-primary" : "text-muted-foreground"
                          )}>
                            {result.awayscore}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1 text-right">
                        <h3 className="font-bold text-lg truncate">{game.awayteam}</h3>
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
