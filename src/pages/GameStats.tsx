import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Trophy, MapPin, Tv, Users } from "lucide-react";
import type { ScheduleItem, GameResult } from "@/types/euroleague-api";
import { XMLParser } from "fast-xml-parser";
import { Badge } from "@/components/ui/badge";

export default function GameStats() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [results, setResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch schedules
        const scheduleResponse = await fetch(
          "https://api-live.euroleague.net/v1/schedules?seasonCode=E2024&gameNumber=22"
        );
        
        if (!scheduleResponse.ok) {
          throw new Error('Failed to fetch schedules');
        }

        // Fetch results
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

          // Sort by date and time
          const sortedItems = items.sort((a, b) => {
            const dateTimeA = `${a.date} ${a.startime}`;
            const dateTimeB = `${b.date} ${b.startime}`;
            const parsedA = parse(`${dateTimeA}`, 'MMM d, yyyy HH:mm', new Date());
            const parsedB = parse(`${dateTimeB}`, 'MMM d, yyyy HH:mm', new Date());
            return parsedB.getTime() - parsedA.getTime(); // Descending order
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <div className="font-semibold text-lg">{game.hometeam}</div>
                        <div className="text-sm text-muted-foreground">{game.homecode}</div>
                        {result && (
                          <div className="text-2xl font-bold text-primary">
                            {result.homescore}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">vs</div>
                      <div className="flex flex-col items-end">
                        <div className="font-semibold text-lg text-right">{game.awayteam}</div>
                        <div className="text-sm text-muted-foreground">{game.awaycode}</div>
                        {result && (
                          <div className="text-2xl font-bold text-primary">
                            {result.awayscore}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatGameDate(game.date, game.startime)}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{game.startime} - {game.endtime}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Trophy className="w-4 h-4 mr-2" />
                      <span>Round {game.gameday} - {game.group}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{game.arenaname}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Capacity: {game.arenacapacity}</span>
                    </div>

                    {(game.hometv || game.awaytv) && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Tv className="w-4 h-4 mr-2" />
                        <div className="flex flex-wrap gap-2">
                          {game.hometv && (
                            <Badge variant="secondary">Home TV: {game.hometv}</Badge>
                          )}
                          {game.awaytv && (
                            <Badge variant="secondary">Away TV: {game.awaytv}</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {result && (
                      <div className="mt-2 p-2 bg-muted rounded-md">
                        <div className="text-sm font-medium">
                          Final Score: {result.homescore} - {result.awayscore}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Game #{result.gamenumber} | Code: {result.gamecode}
                        </div>
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