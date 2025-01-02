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
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AllTimeLeaderboardProps {
  searchQuery: string;
}

const USERS_PER_PAGE = 50;

export function AllTimeLeaderboard({ searchQuery }: AllTimeLeaderboardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = window.innerWidth <= 768;

  const { data: allRankings, isLoading, refetch } = useQuery({
    queryKey: ["leaderboard", "all-time", searchQuery, currentPage],
    queryFn: async () => {
      const startRange = (currentPage - 1) * USERS_PER_PAGE;
      const endRange = startRange + USERS_PER_PAGE - 1;

      let query = supabase
        .from("profiles")
        .select(`
          id,
          display_name,
          total_points,
          points_per_game,
          total_predictions,
          avatar_url
        `)
        .gt('total_predictions', 0)
        .order("total_points", { ascending: false })
        .range(startRange, endRange);

      if (searchQuery) {
        query = query.ilike('display_name', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      const rankedData = data.map((player, index) => ({
        ...player,
        rank: startRange + index + 1
      }));

      return rankedData;
    },
  });

  const { data: totalCount } = useQuery({
    queryKey: ["leaderboard", "all-time", "count", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select('id', { count: 'exact', head: true })
        .gt('total_predictions', 0);

      if (searchQuery) {
        query = query.ilike('display_name', `%${searchQuery}%`);
      }

      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  });

  const totalPages = Math.ceil((totalCount || 0) / USERS_PER_PAGE);

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
    <div className="space-y-4">
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
                isRoundLeaderboard={false}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)}
                className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
            
            {!isMobile && Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                const distance = Math.abs(page - currentPage);
                return distance === 0 || distance === 1 || page === 1 || page === totalPages;
              })
              .map((page, index, array) => {
                if (index > 0 && array[index - 1] !== page - 1) {
                  return (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <PaginationLink className="pointer-events-none">...</PaginationLink>
                    </PaginationItem>
                  );
                }
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
                className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}