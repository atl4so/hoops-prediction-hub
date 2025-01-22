import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
      partials: {
        Partial1: string;
        Partial2: string;
        Partial3: string;
        Partial4: string;
      };
    };
    roadclub: {
      name: string;
      score: number;
      partials: {
        Partial1: string;
        Partial2: string;
        Partial3: string;
        Partial4: string;
      };
    };
  };
}

export function GameOverview({ game }: GameOverviewProps) {
  const gameDate = game.cetdate ? parseISO(game.cetdate) : null;
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Game Header */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center space-y-6">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-2xl sm:text-3xl font-display font-bold">
              <span className="text-primary/90">{game.localclub.name}</span>
              <span className="text-muted-foreground">vs</span>
              <span className="text-primary/90">{game.roadclub.name}</span>
            </div>
            <div className="flex justify-center items-center gap-6 sm:gap-8">
              <span className="text-4xl sm:text-6xl font-display font-bold tracking-tight">{game.localclub.score}</span>
              <span className="text-2xl sm:text-4xl text-muted-foreground">-</span>
              <span className="text-4xl sm:text-6xl font-display font-bold tracking-tight">{game.roadclub.score}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Info */}
      <Card className="overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {game.stadiumname && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Location</p>
                  <p className="font-semibold mt-1">{game.stadiumname}</p>
                </div>
              </div>
            )}
            {game.audience && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Attendance</p>
                  <p className="font-semibold mt-1">{game.audience.toLocaleString()}</p>
                </div>
              </div>
            )}
            {gameDate && (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Date</p>
                    <p className="font-semibold mt-1">
                      {format(gameDate, 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Time (CET)</p>
                    <p className="font-semibold mt-1">
                      {format(gameDate, 'HH:mm')}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quarter Scores */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <h3 className="text-lg font-display font-semibold mb-6">Quarter Scores</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px]">Team</TableHead>
                  <TableHead className="text-center">Q1</TableHead>
                  <TableHead className="text-center">Q2</TableHead>
                  <TableHead className="text-center">Q3</TableHead>
                  <TableHead className="text-center">Q4</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-medium">{game.localclub.name}</TableCell>
                  <TableCell className="text-center font-medium">{game.localclub.partials.Partial1}</TableCell>
                  <TableCell className="text-center font-medium">{game.localclub.partials.Partial2}</TableCell>
                  <TableCell className="text-center font-medium">{game.localclub.partials.Partial3}</TableCell>
                  <TableCell className="text-center font-medium">{game.localclub.partials.Partial4}</TableCell>
                  <TableCell className="text-center font-bold text-lg text-primary">{game.localclub.score}</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-medium">{game.roadclub.name}</TableCell>
                  <TableCell className="text-center font-medium">{game.roadclub.partials.Partial1}</TableCell>
                  <TableCell className="text-center font-medium">{game.roadclub.partials.Partial2}</TableCell>
                  <TableCell className="text-center font-medium">{game.roadclub.partials.Partial3}</TableCell>
                  <TableCell className="text-center font-medium">{game.roadclub.partials.Partial4}</TableCell>
                  <TableCell className="text-center font-bold text-lg text-primary">{game.roadclub.score}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}