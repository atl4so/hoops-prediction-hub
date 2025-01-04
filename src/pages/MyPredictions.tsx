import { DashboardPredictions } from "@/components/dashboard/sections/DashboardPredictions";
import { useUserPredictions } from "@/components/dashboard/useUserPredictions";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function MyPredictions() {
  const { session } = useSessionContext();
  const { predictionsByRound } = useUserPredictions(session?.user?.id);

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <section className="text-center space-y-4 mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black dark:text-black">
          My Predictions
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track your predictions and their outcomes
        </p>
      </section>
      {session?.user && (
        <DashboardPredictions
          predictionsByRound={predictionsByRound}
          userName={session.user.email || ""}
        />
      )}
    </div>
  );
}