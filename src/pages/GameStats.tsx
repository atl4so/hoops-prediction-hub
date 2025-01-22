import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock } from "lucide-react";
import type { ScheduleItem } from "@/types/euroleague-api";
import { XMLParser } from "fast-xml-parser";

export default function GameStats() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(
          "https://api-live.euroleague.net/v1/schedules?seasonCode=E2024&gameNumber=22"
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch schedules');
        }

        const xmlText = await response.text();
        const parser = new XMLParser({ ignoreAttributes: false });
        const result = parser.parse(xmlText);
        
        if (result.schedule?.item) {
          const items = Array.isArray(result.schedule.item) 
            ? result.schedule.item 
            : [result.schedule.item];

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
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setError('Failed to load schedules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const formatGameDate = (dateStr: string, timeStr: string) => {
    try {
      const date = parse(dateStr, 'MMM d, yyyy', new Date());
      return format(date, 'MMMM d, yyyy') + ' at ' + timeStr;
    } catch (err) {
      return dateStr + ' at ' + timeStr;
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
          schedules.map((game) => (
            <Card 
              key={game.gamecode}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="font-semibold text-lg">{game.hometeam}</div>
                    <div className="text-sm text-muted-foreground">vs</div>
                    <div className="font-semibold text-lg text-right">{game.awayteam}</div>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatGameDate(game.date, game.startime)}</span>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{game.startime} - {game.endtime}</span>
                  </div>

                  <div className="text-sm text-muted-foreground mt-2">
                    {game.arenaname} ({game.arenacapacity} capacity)
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}