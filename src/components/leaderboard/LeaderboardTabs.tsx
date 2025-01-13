import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllTimeLeaderboard } from "./AllTimeLeaderboard";
import { RoundLeaderboard } from "./RoundLeaderboard";
import { Trophy, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { RoundSelector } from "@/components/dashboard/predictions/RoundSelector";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function LeaderboardTabs() {
  const [selectedRound, setSelectedRound] = useState("");

  // Query to find the latest round with actual data
  const { data: latestRoundWithData } = useQuery({
    queryKey: ["latest-round-with-data"],
    queryFn: async () => {
      console.log('Finding latest round with data...');
      
      // Get all rounds ordered by start date (most recent first)
      const { data: rounds, error: roundsError } = await supabase
        .from('rounds')
        .select('id')
        .order('start_date', { ascending: false });

      if (roundsError) throw roundsError;

      // For each round, check if it has both stats and finished games
      for (const round of rounds || []) {
        // Check for round stats
        const { data: stats } = await supabase
          .from('round_user_stats')
          .select('total_points')
          .eq('round_id', round.id)
          .gt('total_points', 0)
          .limit(1);

        // Check for finished games
        const { data: games } = await supabase
          .from('games')
          .select(`
            id,
            game_results!inner(is_final)
          `)
          .eq('round_id', round.id)
          .eq('game_results.is_final', true)
          .limit(1);

        // If both conditions are met, this is our latest valid round
        if (stats?.length && games?.length) {
          console.log('Found latest round with data:', round.id);
          return round.id;
        }
      }
      
      // If no round with data is found, return the latest round
      console.log('No rounds with complete data found, defaulting to latest round');
      return rounds?.[0]?.id || "";
    },
  });

  useEffect(() => {
    if (latestRoundWithData && !selectedRound) {
      setSelectedRound(latestRoundWithData);
    }
  }, [latestRoundWithData, selectedRound]);

  return (
    <Tabs defaultValue="by-round" className="space-y-8">
      <section className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          See who's leading in predictions across all time and by round
        </p>
      </section>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <TabsList className="h-12 w-full max-w-[400px] p-1 bg-background/50 backdrop-blur-sm">
          <TabsTrigger 
            value="all-time" 
            className="flex-1 h-10 px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="font-semibold">All Time</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="by-round"
            className="flex-1 h-10 px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-semibold">By Round</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="by-round" asChild>
          <div className="w-full sm:w-[200px]">
            <RoundSelector
              selectedRound={selectedRound}
              onRoundChange={setSelectedRound}
              className="w-full"
            />
          </div>
        </TabsContent>
      </div>

      <div className="min-h-[400px] animate-fade-in">
        <TabsContent value="all-time" className="m-0 mt-6">
          <AllTimeLeaderboard />
        </TabsContent>

        <TabsContent value="by-round" className="m-0 mt-6">
          <RoundLeaderboard selectedRound={selectedRound} />
        </TabsContent>
      </div>
    </Tabs>
  );
}