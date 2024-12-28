import { LeaderboardTabs } from "@/components/leaderboard/LeaderboardTabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Leaderboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">
          See who's leading in predictions across all time and by round
        </p>
      </section>

      <div className="max-w-sm mx-auto mb-8">
        <Input
          type="search"
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <LeaderboardTabs searchQuery={searchQuery} />
    </div>
  );
}