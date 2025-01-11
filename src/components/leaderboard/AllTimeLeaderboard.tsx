import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeaderboardRow } from "./LeaderboardRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type SortField = 'points' | 'winner' | 'games' | 'ppg';
type SortDirection = 'asc' | 'desc';

export function AllTimeLeaderboard() {
  const [sortField, setSortField] = useState<SortField>('points');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["allTimeLeaderboard"],
    queryFn: async () => {
      const { data: predictions, error } = await supabase
        .from("predictions")
        .select(`
          points_earned,
          user:profiles!predictions_user_id_fkey (
            id,
            display_name,
            avatar_url,
            winner_predictions_correct,
            winner_predictions_total,
            points_per_game
          ),
          game:games!inner (
            id
          )
        `)
        .not('points_earned', 'is', null);

      if (error) throw error;

      // Aggregate user data
      const userStats = predictions.reduce((acc: any, pred) => {
        const userId = pred.user.id;
        if (!acc[userId]) {
          acc[userId] = {
            user_id: userId,
            display_name: pred.user.display_name,
            avatar_url: pred.user.avatar_url,
            total_points: 0,
            total_predictions: 0,
            points_per_game: pred.user.points_per_game,
            winner_predictions_correct: pred.user.winner_predictions_correct,
            winner_predictions_total: pred.user.winner_predictions_total
          };
        }
        acc[userId].total_predictions += 1;
        acc[userId].total_points += pred.points_earned || 0;
        return acc;
      }, {});

      return Object.values(userStats);
    }
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
        case 'ppg':
          comparison = a.points_per_game - b.points_per_game;
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

  const sortedData = sortData(leaderboardData || []);

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
                <SortHeader field="winner">Winner</SortHeader>
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
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}