import { RoundSelector } from "@/components/dashboard/predictions/RoundSelector";
import { UserPredictionsGrid } from "@/components/dashboard/predictions/UserPredictionsGrid";
import { DownloadPredictionsButton } from "@/components/dashboard/DownloadPredictionsButton";

interface DashboardPredictionsProps {
  predictionsByRound: Record<
    string,
    { roundId: string; roundName: string; predictions: Array<any> }
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
          predictions={predictionsByRound}
          userName={userName}
        />
      </div>

      <div className="space-y-8">
        {rounds.map(({ roundId, roundName, predictions }) => (
          <UserPredictionsGrid
            key={roundId}
            roundId={roundId}
            roundName={roundName}
            predictions={predictions}
          />
        ))}
      </div>
    </div>
  );
}