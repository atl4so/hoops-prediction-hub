import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Calendar, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";

interface GameOverviewProps {
  game: {
    cetdate?: string;
    stadium?: string;
    stadiumname?: string;
    audience?: number;
    localclub: {
      name: string;
      score: number;
    };
    roadclub: {
      name: string;
      score: number;
    };
  };
}

export function GameOverview({ game }: GameOverviewProps) {
  const gameDate = game.cetdate ? parseISO(game.cetdate) : null;
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Game Score Header */}
      <Card className="bg-gradient-to-br from-background to-muted/5 border border-border/50">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            {game.localclub.name} {game.localclub.score} - {game.roadclub.score} {game.roadclub.name}
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {game.stadiumname && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Location</p>
                  <p className="font-medium mt-1">{game.stadiumname}</p>
                </div>
              </div>
            )}
            {game.audience && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Attendance</p>
                  <p className="font-medium mt-1">{game.audience.toLocaleString()}</p>
                </div>
              </div>
            )}
            {gameDate && (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Date</p>
                    <p className="font-medium mt-1">
                      {format(gameDate, 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Time (CET)</p>
                    <p className="font-medium mt-1">
                      {format(gameDate, 'HH:mm')}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}