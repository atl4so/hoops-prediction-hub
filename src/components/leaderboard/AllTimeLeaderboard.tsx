import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardRow } from "./LeaderboardRow";
import { useIsMobile } from "@/hooks/use-mobile";

interface AllTimeLeaderboardProps {
  searchQuery: string;
}

export function AllTimeLeaderboard({ searchQuery }: AllTimeLeaderboardProps) {
  const isMobile = useIsMobile();
  const { data: allRankings, isLoading, refetch } = useQuery({
    queryKey: ["leaderboard", "all-time", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          display_name,
          total_points,
          points_per_game,
          total_predictions
        `)
        .gt('total_predictions', 0)
        .order("total_points", { ascending: false })
        .limit(100);

      if (error) throw error;
      
      const rankedData = data.map((player, index) => ({
        ...player,
        rank: index + 1
      }));

      if (searchQuery) {
        return rankedData.filter(player => 
          player.display_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return rankedData;
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Points</TableHead>
            {!isMobile && (
              <>
                <TableHead className="text-right">PPG</TableHead>
                <TableHead className="text-right">Predictions</TableHead>
              </>
            )}
            <TableHead className="w-28"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allRankings?.map((player) => (
            <LeaderboardRow
              key={player.id}
              player={player}
              rank={player.rank}
              onFollowChange={refetch}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}