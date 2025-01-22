import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Users, Calendar, Clock } from "lucide-react";

interface GameOverviewProps {
  game: any; // We'll type this properly later
}

export function GameOverview({ game }: GameOverviewProps) {
  const isFinal = game.played;
  const localTeam = game.localclub;
  const roadTeam = game.roadclub;

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <Card className="bg-background/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold">
              {localTeam.name} vs {roadTeam.name}
            </h1>
            <p className="text-muted-foreground">
              {new Date(game.cetdate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Score Display */}
          <div className="mt-8 grid grid-cols-3 items-center gap-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">{localTeam.name}</h2>
              <p className="text-4xl font-bold mt-2">{localTeam.score}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-muted-foreground">vs</span>
              {isFinal && (
                <p className="text-sm font-medium text-muted-foreground mt-1">FINAL</p>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{roadTeam.name}</h2>
              <p className="text-4xl font-bold mt-2">{roadTeam.score}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{game.stadiumname}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="font-medium">{game.audience?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(game.cetdate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Time (CET)</p>
                <p className="font-medium">
                  {new Date(game.cetdate).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })}
                </p>
              </div>
            </div>
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
                  <TableCell className="font-medium">{localTeam.name}</TableCell>
                  <TableCell className="text-center font-medium text-orange-500">
                    {localTeam.partials.Partial1}
                  </TableCell>
                  <TableCell className="text-center font-medium text-orange-500">
                    {localTeam.partials.Partial2}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {localTeam.partials.Partial3}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {localTeam.partials.Partial4}
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {localTeam.score}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{roadTeam.name}</TableCell>
                  <TableCell className="text-center font-medium">
                    {roadTeam.partials.Partial1}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {roadTeam.partials.Partial2}
                  </TableCell>
                  <TableCell className="text-center font-medium text-orange-500">
                    {roadTeam.partials.Partial3}
                  </TableCell>
                  <TableCell className="text-center font-medium text-orange-500">
                    {roadTeam.partials.Partial4}
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {roadTeam.score}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}