import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllTimeLeaderboard } from "./AllTimeLeaderboard";
import { RoundLeaderboard } from "./RoundLeaderboard";
import { Trophy, Calendar } from "lucide-react";
import { useState } from "react";
import { RoundSelector } from "@/components/ui/round-selector";

export function LeaderboardTabs() {
  const [selectedRound, setSelectedRound] = useState("");

  return (
    <Tabs defaultValue="all-time" className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="all-time" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            All Time
          </TabsTrigger>
          <TabsTrigger value="by-round" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            By Round
          </TabsTrigger>
        </TabsList>
        <RoundSelector
          selectedRound={selectedRound}
          onRoundChange={setSelectedRound}
          className="w-full max-w-[200px]"
        />
      </div>

      <div className="min-h-[400px]">
        <TabsContent value="all-time" className="m-0">
          <AllTimeLeaderboard />
        </TabsContent>

        <TabsContent value="by-round" className="m-0">
          <RoundLeaderboard selectedRound={selectedRound} />
        </TabsContent>
      </div>
    </Tabs>
  );
}