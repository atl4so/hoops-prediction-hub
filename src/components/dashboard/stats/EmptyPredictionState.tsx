interface EmptyPredictionStateProps {
  selectedRound: string;
  upcomingGamesInRound?: boolean;
}

export function EmptyPredictionState({ selectedRound, upcomingGamesInRound }: EmptyPredictionStateProps) {
  if (!selectedRound) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Select a round to view predictions
      </div>
    );
  }

  return (
    <div className="text-center py-6 text-muted-foreground">
      No completed predictions found for this round
    </div>
  );
}