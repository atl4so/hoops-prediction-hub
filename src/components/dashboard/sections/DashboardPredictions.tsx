import { RoundSelector } from "@/components/dashboard/predictions/RoundSelector";
import { UserPredictionsGrid } from "@/components/dashboard/predictions/UserPredictionsGrid";
import { DownloadPredictionsButton } from "@/components/dashboard/DownloadPredictionsButton";

interface DashboardPredictionsProps {
  predictionsByRound: Record<
    string,
    { 
      roundId: string; 
      roundName: string; 
      predictions: Array<{
        id: string;
        game: {
          id: string;
          game_date: string;
          home_team: {
            name: string;
            logo_url: string;
          };
          away_team: {
            name: string;
            logo_url: string;
          };
          game_results: Array<{
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
    }
  >;
  userName: string;
}

export function DashboardPredictions({
  predictionsByRound,
  userName,
}: DashboardPredictionsProps) {
  const rounds = Object.values(predictionsByRound);
  const latestRound = rounds[0]?.roundId || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <RoundSelector
          selectedRound={latestRound}
          onRoundChange={(roundId) => {
            const element = document.getElementById(`round-${roundId}`);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="w-[200px]"
        />
        <DownloadPredictionsButton
          userName={userName}
          roundName={rounds[0]?.roundName || ""}
          predictions={rounds[0]?.predictions || []}
        />
      </div>

      <div className="space-y-8">
        {rounds.map(({ roundId, roundName, predictions }) => {
          // Transform the predictions to match the expected format while preserving the id
          const formattedPredictions = predictions.map(pred => ({
            id: pred.id,
            game: pred.game,
            prediction: pred.prediction
          }));

          return (
            <div key={roundId} id={`round-${roundId}`}>
              <UserPredictionsGrid
                predictions={formattedPredictions}
                isLoading={false}
                roundId={roundId}
                roundName={roundName}
                isOwnPredictions={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}