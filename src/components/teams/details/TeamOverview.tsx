import { TeamPredictionPatterns } from "./TeamPredictionPatterns";
import { TeamTopPredictors } from "./TeamTopPredictors";
import { BestTeamsPredictions } from "./BestTeamsPredictions";

interface TeamOverviewProps {
  stats: {
    total_games: number;
    total_predictions: number;
    overall_success_rate: number;
    home_success_rate: number;
    away_success_rate: number;
    underdog_wins: number;
    unexpected_losses: number;
    avg_upset_margin: number;
    avg_loss_margin: number;
    margin_1_9_wins: number;
    margin_10_15_wins: number;
    margin_15plus_wins: number;
    margin_1_9_losses: number;
    margin_10_15_losses: number;
    margin_15plus_losses: number;
    home_games: number;
    away_games: number;
    percentage_favoring_team: number;
    wins_predicted: number;
    losses_predicted: number;
  } | null;
  distribution: {
    margin_range: string;
    win_percentage: number;
    loss_percentage: number;
  }[] | null;
  teamId: string;
}

export function TeamOverview({ stats, distribution, teamId }: TeamOverviewProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <BestTeamsPredictions teams={[]} />
      <TeamPredictionPatterns stats={stats} />
      <TeamTopPredictors teamId={teamId} />
    </div>
  );
}