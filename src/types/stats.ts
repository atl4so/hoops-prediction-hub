export interface RoundRank {
  rank: number | null;
  roundId: string;
  roundName: string;
  isCurrent: boolean;
}

export interface StatsListProps {
  totalPoints: number;
  pointsPerGame: number;
  totalPredictions: number;
  highestGamePoints?: number | null;
  highestRoundPoints?: number | null;
  allTimeRank?: number | null;
  currentRoundRank?: { rank: number | null; isCurrent: boolean; roundName: string };
  winnerPredictionsCorrect?: number;
  winnerPredictionsTotal?: number;
  homeWinnerPredictionsCorrect?: number;
  homeWinnerPredictionsTotal?: number;
  awayWinnerPredictionsCorrect?: number;
  awayWinnerPredictionsTotal?: number;
  userId?: string;
}