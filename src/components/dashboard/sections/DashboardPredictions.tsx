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
          roundId={round.roundId}
          roundName={round.roundName}
          predictions={round.predictions}
          userName={userName}
        />
      ))}
    </div>
  );
};