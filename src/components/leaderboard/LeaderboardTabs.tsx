import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllTimeLeaderboard } from "./AllTimeLeaderboard";
import { RoundLeaderboard } from "./RoundLeaderboard";
import { Trophy, Calendar } from "lucide-react";

export function LeaderboardTabs() {
  return (
    <Tabs defaultValue="all-time" className="space-y-6">
      <TabsList>
        <TabsTrigger value="all-time">
          <Trophy className="h-4 w-4 mr-2" />
          All Time
        </TabsTrigger>
        <TabsTrigger value="by-round">
          <Calendar className="h-4 w-4 mr-2" />
          By Round
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all-time">
        <AllTimeLeaderboard />
      </TabsContent>

      <TabsContent value="by-round">
        <RoundLeaderboard />
      </TabsContent>
    </Tabs>
  );
}