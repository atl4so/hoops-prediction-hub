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
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
          Scoring Rules
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          Learn how points are calculated for your predictions
        </p>
      </section>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Points are calculated automatically after each game. Updates may take up to 6 hours.
        </AlertDescription>
      </Alert>
      
      <BasicCriteria />
      <PointsBreakdown />
      <TeamScorePoints />
      <ImportantNotes />
    </div>
  );
}