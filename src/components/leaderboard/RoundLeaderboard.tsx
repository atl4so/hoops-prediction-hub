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
import { toast } from "sonner";

interface RoundLeaderboardProps {
  selectedRound: string;
}

export function RoundLeaderboard({ selectedRound }: RoundLeaderboardProps) {
  const { data: rankings, isLoading, isError, error } = useQuery({
    queryKey: ["roundRankings", selectedRound],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_round_rankings', {
            round_id: selectedRound
          });

        if (error) {
          console.error('Error fetching round rankings:', error);
          throw error;
        }

        // Fetch avatar URLs for all users
        const userIds = data.map((player: any) => player.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        // Merge avatar URLs with rankings data
        return data.map((player: any) => ({
          ...player,
          avatar_url: profiles?.find((p: any) => p.id === player.user_id)?.avatar_url
        }));
      } catch (err) {
        console.error('Error in rankings query:', err);
        throw err;
      }
    },
    enabled: !!selectedRound,
    retry: 3,
    retryDelay: 1000,
    onError: (err) => {
      console.error('Error fetching round rankings:', err);
      toast.error("Failed to load rankings. Please try again later.");
    }
  });

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

  if (isError) {
    return (
      <Card className="w-full p-8 text-center">
        <p className="text-muted-foreground">
          Unable to load rankings. Please try again later.
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden border-2 bg-card/50 backdrop-blur-sm">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-2">
              <TableHead className="w-20 font-bold text-base">Rank</TableHead>
              <TableHead className="font-bold text-base">Player</TableHead>
              <TableHead className="text-right font-bold text-base">Points</TableHead>
              <TableHead className="text-right font-bold text-base">Games</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings?.map((player: any, index: number) => (
              <LeaderboardRow
                key={player.user_id}
                player={{
                  user_id: player.user_id,
                  display_name: player.display_name,
                  total_points: player.total_points,
                  total_predictions: player.predictions_count,
                  avatar_url: player.avatar_url
                }}
                rank={index + 1}
                index={index}
                isRoundLeaderboard={true}
              />
            ))}
            {!rankings?.length && (
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