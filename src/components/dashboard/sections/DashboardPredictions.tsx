import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { PredictionsPDF } from "../PredictionsPDF";
import { CollapsibleRoundSection } from "../CollapsibleRoundSection";

interface DashboardPredictionsProps {
  predictionsByRound: Record<string, {
    roundId: string;
    roundName: string;
    predictions: Array<any>;
  }>;
  userName: string;
}

export const DashboardPredictions = ({ predictionsByRound, userName }: DashboardPredictionsProps) => {
  const rounds = Object.values(predictionsByRound).sort((a, b) => 
    b.roundName.localeCompare(a.roundName)
  );

  if (rounds.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No predictions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rounds.map((round) => (
        <CollapsibleRoundSection
          key={round.roundId}
          roundName={round.roundName}
          predictions={round.predictions}
          extraContent={
            <PDFDownloadLink
              document={
                <PredictionsPDF
                  userName={userName}
                  roundName={round.roundName}
                  predictions={round.predictions}
                />
              }
              fileName={`predictions-${round.roundName.toLowerCase().replace(/\s+/g, '-')}.pdf`}
            >
              {({ loading }) => (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  disabled={loading}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </PDFDownloadLink>
          }
        />
      ))}
    </div>
  );
};