import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function AllTimeLeaderboard() {
  const { data: rankings, isLoading } = useQuery({
    queryKey: ["leaderboard", "all-time"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("total_points", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Award className="h-5 w-5 text-primary/20" />;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="text-right">PPG</TableHead>
            <TableHead className="text-right">Predictions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankings?.map((player, index) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {getRankIcon(index + 1)}
                  {index + 1}
                </div>
              </TableCell>
              <TableCell>{player.display_name}</TableCell>
              <TableCell className="text-right">{player.total_points}</TableCell>
              <TableCell className="text-right">
                {player.points_per_game?.toFixed(1)}
              </TableCell>
              <TableCell className="text-right">
                {player.total_predictions}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}