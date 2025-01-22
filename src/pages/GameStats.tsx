import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Trophy, MapPin, Users } from "lucide-react";
import type { ScheduleItem, GameResult } from "@/types/euroleague-api";
import { XMLParser } from "fast-xml-parser";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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
      return format(date, 'MMMM d, yyyy') + ' at ' + timeStr;
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3" />
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
                  "hover:shadow-lg transition-shadow duration-200 cursor-pointer",
                  "bg-gradient-to-br from-background to-accent/5 border-border/50"
                )}
                onClick={() => handleGameClick(game.gamecode)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-6">
                    {/* Teams and Score Section */}
                    <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                      <div className="flex flex-col items-start">
                        <h3 className="font-bold text-xl">{game.hometeam}</h3>
                        <span className="text-sm text-muted-foreground">{game.homecode}</span>
                        {result && (
                          <span className="text-4xl font-bold text-primary tabular-nums mt-2">
                            {result.homescore}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground self-start mt-2">
                        vs
                      </div>

                      <div className="flex flex-col items-end text-right">
                        <h3 className="font-bold text-xl">{game.awayteam}</h3>
                        <span className="text-sm text-muted-foreground">{game.awaycode}</span>
                        {result && (
                          <span className="text-4xl font-bold text-primary tabular-nums mt-2">
                            {result.awayscore}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Game Info Section */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatGameDate(game.date, game.startime)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        <span>Round {game.gameday} - {game.group}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{game.arenaname}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Capacity: {game.arenacapacity}</span>
                      </div>
                    </div>

                    {result && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-sm font-medium text-muted-foreground">
                          Final Score: {result.homescore} - {result.awayscore}
                        </p>
                      </div>
                    )}
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