import { CollapsibleRoundSection } from "../CollapsibleRoundSection";
import { RoundSummaryDialog } from "../predictions/RoundSummaryDialog";

interface DashboardPredictionsProps {
  predictionsByRound: Record<string, {
    roundId: string;
    roundName: string;
    predictions: Array<{
      id: string;
      game: {
        id: string;
        game_date: string;
        round: {
          id: string;
          name: string;
        };
        home_team: {
          id: string;
          name: string;
          logo_url: string;
        };
        away_team: {
          id: string;
          name: string;
          logo_url: string;
        };
        game_results?: Array<{
          home_score: number;
          away_score: number;
          is_final: boolean;
        }>;
      };
      prediction: {
        prediction_home_score: number;
        prediction_away_score: number;
        points_earned?: number;
      };
    }>;
  }>;
  userName: string;
}

export const DashboardPredictions = ({ predictionsByRound, userName }: DashboardPredictionsProps) => {
  if (!predictionsByRound) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No predictions found</p>
      </div>
    );
  }

  // Convert predictionsByRound to array and filter out invalid entries
  const rounds = Object.entries(predictionsByRound)
    .map(([key, value]) => ({
      roundId: value?.roundId || key,
      roundName: value?.roundName || '',
      predictions: value?.predictions || []
    }))
    .filter(round => round.predictions.length > 0)
    .sort((a, b) => parseInt(b.roundName) - parseInt(a.roundName));

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
          extraContent={
            <RoundSummaryDialog
              roundName={round.roundName}
              userName={userName}
              predictions={round.predictions}
            />
          }
        />
      ))}
    </div>
  );
};