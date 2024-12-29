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
import { RoundSelector } from "../dashboard/predictions/RoundSelector";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface RoundLeaderboardProps {
  searchQuery: string;
}

const USERS_PER_PAGE = 50;

export function RoundLeaderboard({ searchQuery }: RoundLeaderboardProps) {
  const [selectedRound, setSelectedRound] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = window.innerWidth <= 768;

  const { data: rankings, isLoading, refetch } = useQuery({
    queryKey: ["leaderboard", "round", selectedRound, searchQuery, currentPage],
    queryFn: async () => {
      if (!selectedRound) return null;

      const startRange = (currentPage - 1) * USERS_PER_PAGE;
      const endRange = startRange + USERS_PER_PAGE - 1;

      const { data, error } = await supabase
        .rpc('get_round_rankings', { round_id: selectedRound })
        .range(startRange, endRange);

      if (error) throw error;

      const filteredData = searchQuery
        ? data.filter(player => 
            player.display_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : data;

      return filteredData.map((player, index) => ({
        ...player,
        rank: startRange + index + 1
      }));
    },
    enabled: !!selectedRound,
  });

  const { data: totalCount } = useQuery({
    queryKey: ["leaderboard", "round", selectedRound, "count", searchQuery],
    queryFn: async () => {
      if (!selectedRound) return 0;

      const { count, error } = await supabase
        .rpc('get_round_rankings', { round_id: selectedRound })
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    },
    enabled: !!selectedRound,
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
    <div className="space-y-6">
      <RoundSelector selectedRound={selectedRound} onRoundChange={setSelectedRound} />

      {selectedRound && (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="w-28"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings?.map((player) => (
                  <LeaderboardRow
                    key={player.user_id}
                    player={player}
                    rank={player.rank}
                    onFollowChange={refetch}
                    isRoundLeaderboard={true}
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
      )}
    </div>
  );
}