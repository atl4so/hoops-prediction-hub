import { useState } from "react";
import { SortField, SortDirection } from "../components/SortableHeader";

export function useLeaderboardSort() {
  const [sortField, setSortField] = useState<SortField>('points');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortData = (data: any[]) => {
    return [...data].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'points':
          comparison = a.total_points - b.total_points;
          break;
        case 'winner':
          const aWinnerPercent = (a.winner_predictions_correct / a.winner_predictions_total) || 0;
          const bWinnerPercent = (b.winner_predictions_correct / b.winner_predictions_total) || 0;
          comparison = aWinnerPercent - bWinnerPercent;
          break;
        case 'games':
          comparison = a.total_predictions - b.total_predictions;
          break;
        case 'ppg':
          comparison = (a.points_per_game || 0) - (b.points_per_game || 0);
          break;
        case 'efficiency':
          comparison = (a.efficiency_rating || 0) - (b.efficiency_rating || 0);
          break;
        case 'underdog':
          comparison = (a.underdog_picks || 0) - (b.underdog_picks || 0);
          break;
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  };

  return {
    sortField,
    sortDirection,
    handleSort,
    sortData
  };
}