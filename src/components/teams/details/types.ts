export interface TeamPredictor {
  user_id: string;
  display_name: string;
  success_rate: number;
  correct_predictions: number;
  total_predictions: number;
  avatar_url?: string;
}