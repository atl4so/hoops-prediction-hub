import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeaderboardRow } from "./LeaderboardRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type SortField = 'points' | 'winner' | 'games';
type SortDirection = 'asc' | 'desc';

interface RoundLeaderboardProps {
  selectedRound: string;
}

export function RoundLeaderboard({ selectedRound }: RoundLeaderboardProps) {
  const [sortField, setSortField] = useState<SortField>('points');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { data: rankings, isLoading } = useQuery({
    queryKey: ["roundRankings", selectedRound],
    queryFn: async () => {
      const { data: roundStats, error } = await supabase
        .from('round_user_stats')
        .select(`
          user_id,
          total_points,
          total_predictions,
          winner_predictions_correct,
          winner_predictions_total,
          user:profiles!round_user_stats_user_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq('round_id', selectedRound);

      if (error) throw error;

      return roundStats.map((stat: any) => ({
        user_id: stat.user_id,
        display_name: stat.user.display_name,
        avatar_url: stat.user.avatar_url,
        total_points: stat.total_points,
        total_predictions: stat.total_predictions,
        winner_predictions_correct: stat.winner_predictions_correct,
        winner_predictions_total: stat.winner_predictions_total
      }));
    },
    enabled: !!selectedRound
  });

  const sortData = (data: any[]) => {
    return [...data].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'points':
          comparison = a.total_points - b.total_points;
          break;
        case 'winner':
          const aWinnerPercent = (a.winner_predictions_correct / a.winner_predictions_total) || 0;
          const bWinnerPercent = (b.winner_predictions_correct / b.winner_predictions_total) || 0;
          comparison = aWinnerPercent - bWinnerPercent;
          break;
        case 'games':
          comparison = a.total_predictions - b.total_predictions;
          break;
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortField === field;
    return (
      <div 
        className="flex items-center gap-1 cursor-pointer group justify-end"
        onClick={() => handleSort(field)}
      >
        {children}
        <span className={cn(
          "transition-opacity",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
        )}>
          {isActive && sortDirection === 'desc' ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </span>
      </div>
    );
  };

  if (!selectedRound) {
    return (
      <Card className="w-full p-8 text-center">
        <p className="text-muted-foreground">Select a round to view rankings</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full p-4 md:p-6">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
          ))}
        </div>
      </Card>
    );
  }

  const sortedData = sortData(rankings || []);

  return (
    <Card className="w-full overflow-hidden border-2 bg-card/50 backdrop-blur-sm">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-2">
              <TableHead className="w-[80px] font-bold text-base">Rank</TableHead>
              <TableHead className="w-[200px] font-bold text-base">Player</TableHead>
              <TableHead className="w-[120px] text-right font-bold text-base">
                <SortHeader field="points">Points</SortHeader>
              </TableHead>
              <TableHead className="w-[120px] text-right font-bold text-base">
                <SortHeader field="winner">Winner %</SortHeader>
              </TableHead>
              <TableHead className="w-[100px] text-right font-bold text-base">
                <SortHeader field="games">Games</SortHeader>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((player: any, index: number) => (
              <LeaderboardRow
                key={player.user_id}
                player={player}
                rank={index + 1}
                index={index}
                isRoundLeaderboard={true}
                roundId={selectedRound}
              />
            ))}
            {!sortedData?.length && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No predictions found for this round
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}