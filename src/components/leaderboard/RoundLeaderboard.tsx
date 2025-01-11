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
import { LeaderboardRow } from "./LeaderboardRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type SortField = 'points' | 'efficiency' | 'underdog' | 'games';
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
          efficiency_rating,
          underdog_prediction_rate,
          user:profiles!round_user_stats_user_id_fkey (
            display_name,
            avatar_url,
            winner_predictions_correct,
            winner_predictions_total,
            home_winner_predictions_correct,
            home_winner_predictions_total,
            away_winner_predictions_correct,
            away_winner_predictions_total
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
        efficiency_rating: stat.efficiency_rating,
        underdog_prediction_rate: stat.underdog_prediction_rate,
        winner_predictions_correct: stat.user.winner_predictions_correct,
        winner_predictions_total: stat.user.winner_predictions_total,
        home_winner_predictions_correct: stat.user.home_winner_predictions_correct,
        home_winner_predictions_total: stat.user.home_winner_predictions_total,
        away_winner_predictions_correct: stat.user.away_winner_predictions_correct,
        away_winner_predictions_total: stat.user.away_winner_predictions_total
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
        case 'efficiency':
          comparison = a.efficiency_rating - b.efficiency_rating;
          break;
        case 'underdog':
          comparison = a.underdog_prediction_rate - b.underdog_prediction_rate;
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
        className="flex items-center gap-1 cursor-pointer group"
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
              <TableHead className="w-20 font-bold text-base">Rank</TableHead>
              <TableHead className="font-bold text-base">Player</TableHead>
              <TableHead className="text-right font-bold text-base">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-full justify-start">
                      <SortHeader field="points">Points</SortHeader>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSort('points')}>
                      Total Points
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('efficiency')}>
                      Efficiency Rating
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('underdog')}>
                      Underdog Rate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead className="text-right font-bold text-base">
                <SortHeader field="games">Games</SortHeader>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((player: any, index: number) => (
              <LeaderboardRow
                key={player.user_id}
                player={{
                  ...player,
                  efficiency_rating: player.efficiency_rating,
                  underdog_prediction_rate: player.underdog_prediction_rate
                }}
                rank={index + 1}
                index={index}
                isRoundLeaderboard={true}
                roundId={selectedRound}
              />
            ))}
            {!sortedData?.length && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
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