import { LeaderboardTabs } from "@/components/leaderboard/LeaderboardTabs";

export default function Leaderboard() {
  return (
    <div className="container max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      <section className="text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary/80 via-primary to-primary/80 text-transparent bg-clip-text animate-gradient">
          Leaderboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See who's leading in predictions across all time and by round
        </p>
      </section>

      <div className="animate-fade-in [--animate-delay:200ms]">
        <LeaderboardTabs />
      </div>
    </div>
  );
}