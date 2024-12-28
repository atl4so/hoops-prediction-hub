import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { FollowButton } from "@/components/users/FollowButton";
import { useFollowStatus } from "@/hooks/useFollowStatus";

interface RoundLeaderboardProps {
  searchQuery: string;
}

export function RoundLeaderboard({ searchQuery }: RoundLeaderboardProps) {
  const [selectedRound, setSelectedRound] = useState<string>("all");

  const { data: rounds } = useQuery({
    queryKey: ["rounds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rounds")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: rankings, isLoading, refetch } = useQuery({
    queryKey: ["leaderboard", "round", selectedRound, searchQuery],
    queryFn: async () => {
      if (!selectedRound || selectedRound === "all") return null;

      const { data, error } = await supabase
        .rpc('get_round_rankings', {
          round_id: selectedRound
        });

      if (error) throw error;
      
      // Add rank to each player before filtering
      const rankedData = data.map((player, index) => ({
        ...player,
        rank: index + 1
      }));
      
      // Filter results based on search query if provided
      if (searchQuery) {
        return rankedData.filter(player => 
          player.display_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      return rankedData;
    },
    enabled: !!selectedRound && selectedRound !== "all",
  });

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
    <div className="space-y-6">
      <Select value={selectedRound} onValueChange={setSelectedRound}>
        <SelectTrigger>
          <SelectValue placeholder="Select a round" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Rounds</SelectItem>
          {rounds?.map((round) => (
            <SelectItem key={round.id} value={round.id}>
              Round {round.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedRound && selectedRound !== "all" && (
        <div className="rounded-md border">
          {isLoading ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Predictions</TableHead>
                  <TableHead className="w-28"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings?.map((player) => (
                  <LeaderboardRow
                    key={player.user_id}
                    player={player}
                    rank={player.rank}
                    getRankIcon={getRankIcon}
                    onFollowChange={refetch}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}

function LeaderboardRow({ player, rank, getRankIcon, onFollowChange }) {
  const { isFollowing, currentUser, isLoading } = useFollowStatus(player.user_id);

  // Don't show follow button for the current user, if already following, or while loading
  const showFollowButton = !isLoading && currentUser && currentUser.id !== player.user_id && !isFollowing;

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {getRankIcon(rank)}
          {rank}
        </div>
      </TableCell>
      <TableCell>{player.display_name}</TableCell>
      <TableCell className="text-right">{player.total_points}</TableCell>
      <TableCell className="text-right">{player.predictions_count}</TableCell>
      <TableCell className="text-right">
        {showFollowButton && (
          <FollowButton
            userId={player.user_id}
            isFollowing={isFollowing}
            onFollowChange={onFollowChange}
          />
        )}
      </TableCell>
    </TableRow>
  );
}