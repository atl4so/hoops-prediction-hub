import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllTimeLeaderboard } from "./AllTimeLeaderboard";
import { RoundLeaderboard } from "./RoundLeaderboard";

export function LeaderboardTabs() {
  return (
    <Tabs defaultValue="all-time" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="all-time">All Time</TabsTrigger>
        <TabsTrigger value="round">By Round</TabsTrigger>
      </TabsList>
      <TabsContent value="all-time">
        <AllTimeLeaderboard />
      </TabsContent>
      <TabsContent value="round">
        <RoundLeaderboard />
      </TabsContent>
    </Tabs>
  );
}