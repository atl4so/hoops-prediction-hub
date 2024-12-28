import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CollapsibleRoundSection } from "../dashboard/CollapsibleRoundSection";
import { subHours } from "date-fns";
import { useSession } from "@supabase/auth-helpers-react";

interface GamesListProps {
  isAuthenticated: boolean;
  userId?: string;
}

export function GamesList({ isAuthenticated, userId }: GamesListProps) {
  const session = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('games-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_results'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['games'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['predictions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: games, isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      console.log("Fetching games...");
      const { data, error } = await supabase
        .from("games")
        .select(`
          id,
          game_date,
          home_team:teams!games_home_team_id_fkey(id, name, logo_url),
          away_team:teams!games_away_team_id_fkey(id, name, logo_url),
          round:rounds(id, name),
          game_results(
            home_score,
            away_score,
            is_final
          )
        `)
        .order("game_date", { ascending: true });

      if (error) {
        console.error("Error fetching games:", error);
        throw error;
      }
      
      console.log("Raw games data:", data);
      
      // Transform the data to ensure game_results is always an array
      return data.map(game => ({
        ...game,
        game_results: Array.isArray(game.game_results) 
          ? game.game_results 
          : game.game_results 
            ? [game.game_results] 
            : []
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((roundIndex) => (
          <div key={roundIndex} className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[200px]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Filter games to show only those that are available for predictions
  const now = new Date();
  const availableGames = games?.filter(game => {
    const gameDate = new Date(game.game_date);
    const predictionDeadline = subHours(gameDate, 1);
    
    // Show games that have no results or non-final results
    // AND current time is before prediction deadline
    const hasNoFinalResult = !game.game_results?.some(result => result.is_final);
    const isBeforeDeadline = now < predictionDeadline;
    
    console.log(`Game ${game.id}:`, {
      hasNoFinalResult,
      isBeforeDeadline,
      gameResults: game.game_results,
      predictionDeadline: predictionDeadline.toISOString(),
      now: now.toISOString()
    });
    
    return hasNoFinalResult && isBeforeDeadline;
  }) || [];

  console.log("Available games:", availableGames);

  if (!availableGames?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No games available for predictions at the moment.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Check back later for upcoming games.
        </p>
      </div>
    );
  }

  // Group available games by round
  const gamesByRound = availableGames.reduce((acc, game) => {
    const roundId = game.round.id;
    if (!acc[roundId]) {
      acc[roundId] = {
        name: game.round.name,
        games: []
      };
    }
    acc[roundId].games.push(game);
    return acc;
  }, {} as Record<string, { name: string; games: typeof games }>) || {};

  // Convert to array and sort by round name in descending order
  const sortedRounds = Object.entries(gamesByRound)
    .map(([roundId, data]) => ({
      id: roundId,
      ...data
    }))
    .sort((a, b) => parseInt(b.name) - parseInt(a.name));

  return (
    <div className="space-y-12">
      {sortedRounds.map((round) => (
        <CollapsibleRoundSection
          key={round.id}
          roundId={round.id}
          roundName={round.name}
          predictions={round.games.map(game => ({
            id: game.id,
            game: {
              ...game,
              game_results: game.game_results || []
            },
            prediction: null
          }))}
          userName={session?.user?.email || "User"}
        />
      ))}
    </div>
  );
}