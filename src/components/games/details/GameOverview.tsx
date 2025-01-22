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
    <div className="space-y-6">
      {/* Game Header */}
      <Card className="bg-background/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4 text-2xl font-semibold">
              <span>{game.localclub.name}</span>
              <span>vs</span>
              <span>{game.roadclub.name}</span>
            </div>
            <div className="flex justify-center items-center gap-8 text-4xl font-bold">
              <span>{game.localclub.score}</span>
              <span>-</span>
              <span>{game.roadclub.score}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {game.stadiumname && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{game.stadiumname}</p>
                </div>
              </div>
            )}
            {game.audience && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <p className="font-medium">{game.audience.toLocaleString()}</p>
                </div>
              </div>
            )}
            {gameDate && (
              <>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {format(gameDate, 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time (CET)</p>
                    <p className="font-medium">
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
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quarter Scores</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Team</TableHead>
                  <TableHead className="text-center">Q1</TableHead>
                  <TableHead className="text-center">Q2</TableHead>
                  <TableHead className="text-center">Q3</TableHead>
                  <TableHead className="text-center">Q4</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{game.localclub.name}</TableCell>
                  <TableCell className="text-center">{game.localclub.partials.Partial1}</TableCell>
                  <TableCell className="text-center">{game.localclub.partials.Partial2}</TableCell>
                  <TableCell className="text-center">{game.localclub.partials.Partial3}</TableCell>
                  <TableCell className="text-center">{game.localclub.partials.Partial4}</TableCell>
                  <TableCell className="text-center font-bold">{game.localclub.score}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{game.roadclub.name}</TableCell>
                  <TableCell className="text-center">{game.roadclub.partials.Partial1}</TableCell>
                  <TableCell className="text-center">{game.roadclub.partials.Partial2}</TableCell>
                  <TableCell className="text-center">{game.roadclub.partials.Partial3}</TableCell>
                  <TableCell className="text-center">{game.roadclub.partials.Partial4}</TableCell>
                  <TableCell className="text-center font-bold">{game.roadclub.score}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}