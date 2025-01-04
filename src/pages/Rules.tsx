import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { BasicCriteria } from "@/components/rules/BasicCriteria";
import { PointsBreakdown } from "@/components/rules/PointsBreakdown";
import { TeamScorePoints } from "@/components/rules/TeamScorePoints";
import { ImportantNotes } from "@/components/rules/ImportantNotes";

export default function Rules() {
  return (
    <div className="container max-w-4xl mx-auto space-y-8 py-8 animate-fade-in">
      <section className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground font-display">
          Scoring Rules
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          Learn how points are calculated for your predictions
        </p>
      </section>

      <Alert className="glass-card border-none">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Points are calculated automatically after each game. Updates may take up to 6 hours.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-8">
        <BasicCriteria />
        <PointsBreakdown />
        <TeamScorePoints />
        <ImportantNotes />
      </div>
    </div>
  );
}