import { LeaderboardTabs } from "@/components/leaderboard/LeaderboardTabs";

export default function Leaderboard() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">
          See who's leading in predictions across all time and by round
        </p>
      </section>

      <LeaderboardTabs />
    </div>
  );
}