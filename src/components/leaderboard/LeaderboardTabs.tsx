import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllTimeLeaderboard } from "./AllTimeLeaderboard";
import { RoundLeaderboard } from "./RoundLeaderboard";
import { Trophy, Calendar } from "lucide-react";

export function LeaderboardTabs() {
  return (
    <Tabs defaultValue="all-time" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
        <TabsTrigger value="all-time" className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          All Time
        </TabsTrigger>
        <TabsTrigger value="by-round" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          By Round
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all-time" className="mt-6">
        <AllTimeLeaderboard />
      </TabsContent>

      <TabsContent value="by-round" className="mt-6">
        <RoundLeaderboard />
      </TabsContent>
    </Tabs>
  );
}