import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PredictionFormProps {
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
  homeScore: string;
  awayScore: string;
  onHomeScoreChange: (value: string) => void;
  onAwayScoreChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function PredictionForm({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  onHomeScoreChange,
  onAwayScoreChange,
  onSubmit,
  onCancel,
  isSubmitting
}: PredictionFormProps) {
  return (
    <form onSubmit={onSubmit} className="p-4 border rounded-lg bg-background shadow-sm space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="homeScore">{homeTeam.name}</Label>
          <Input
            id="homeScore"
            type="number"
            min="0"
            value={homeScore}
            onChange={(e) => onHomeScoreChange(e.target.value)}
            placeholder="Score"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="awayScore">{awayTeam.name}</Label>
          <Input
            id="awayScore"
            type="number"
            min="0"
            value={awayScore}
            onChange={(e) => onAwayScoreChange(e.target.value)}
            placeholder="Score"
            required
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}