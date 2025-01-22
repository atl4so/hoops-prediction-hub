import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PlayerStatsTableProps {
  players: Array<{
    name: string;
    playercode: string;
    minutes: string;
    points: number;
    rebounds: number;
    assists: number;
    fouls: number;
    pir: number;
  }>;
  teamName: string;
}

export function PlayerStatsTable({ players, teamName }: PlayerStatsTableProps) {
  const formatPlayerCode = (code: string) => {
    // Pad the code with leading zeros if needed
    return code.padStart(6, '0');
  };

  return (
    <div>
      <h3 className="font-semibold mb-4">{teamName}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Min</TableHead>
            <TableHead>Pts</TableHead>
            <TableHead>Reb</TableHead>
            <TableHead>Ast</TableHead>
            <TableHead>Fouls</TableHead>
            <TableHead>PIR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.playercode}>
              <TableCell>
                <Link 
                  to={`/player/${formatPlayerCode(player.playercode)}`}
                  className="text-primary hover:underline"
                >
                  {player.name}
                </Link>
              </TableCell>
              <TableCell>{player.minutes}</TableCell>
              <TableCell>{player.points}</TableCell>
              <TableCell>{player.rebounds}</TableCell>
              <TableCell>{player.assists}</TableCell>
              <TableCell>{player.fouls}</TableCell>
              <TableCell>{player.pir}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}