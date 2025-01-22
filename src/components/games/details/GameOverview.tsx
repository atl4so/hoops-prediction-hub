import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GameOverviewProps {
  game: any; // We'll type this properly later
}

export function GameOverview({ game }: GameOverviewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Score Overview */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{game.localclub.name}</h3>
              <p className="text-3xl font-bold">{game.localclub.score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">vs</p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold">{game.roadclub.name}</h3>
              <p className="text-3xl font-bold">{game.roadclub.score}</p>
            </div>
          </div>

          {/* Quarter Scores */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quarter Scores</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">Q1</TableHead>
                  <TableHead className="text-center">Q2</TableHead>
                  <TableHead className="text-center">Q3</TableHead>
                  <TableHead className="text-center">Q4</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{game.localclub.name}</TableCell>
                  <TableCell className="text-center">{game.localclub.partials.Partial1}</TableCell>
                  <TableCell className="text-center">{game.localclub.partials.Partial2}</TableCell>
                  <TableCell className="text-center">{game.localclub.partials.Partial3}</TableCell>
                  <TableCell className="text-center">{game.localclub.partials.Partial4}</TableCell>
                  <TableCell className="text-center font-bold">{game.localclub.score}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{game.roadclub.name}</TableCell>
                  <TableCell className="text-center">{game.roadclub.partials.Partial1}</TableCell>
                  <TableCell className="text-center">{game.roadclub.partials.Partial2}</TableCell>
                  <TableCell className="text-center">{game.roadclub.partials.Partial3}</TableCell>
                  <TableCell className="text-center">{game.roadclub.partials.Partial4}</TableCell>
                  <TableCell className="text-center font-bold">{game.roadclub.score}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          {/* Game Info */}
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Venue:</span> {game.stadiumname}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Attendance:</span> {game.audience}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Date:</span> {new Date(game.cetdate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}