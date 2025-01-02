import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { BasicCriteria } from "@/components/rules/BasicCriteria";
import { PointsBreakdown } from "@/components/rules/PointsBreakdown";
import { TeamScorePoints } from "@/components/rules/TeamScorePoints";
import { ImportantNotes } from "@/components/rules/ImportantNotes";

export default function Rules() {
  return (
    <div className="container max-w-4xl mx-auto space-y-8 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Scoring Rules</h1>

      <Alert className="mb-8">
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