import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PredictionFormProps {
  homeTeam: { name: string };
  awayTeam: { name: string };
  onSubmit: (homeScore: number, awayScore: number) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function PredictionForm({
  homeTeam,
  awayTeam,
  onSubmit,
  onCancel,
  isSubmitting
}: PredictionFormProps) {
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Number(homeScore), Number(awayScore));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-background shadow-sm space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="homeScore" className="text-center">{homeTeam.name}</Label>
          <Input
            id="homeScore"
            type="number"
            min="0"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            placeholder="Score"
            required
            className="text-center"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="awayScore" className="text-center">{awayTeam.name}</Label>
          <Input
            id="awayScore"
            type="number"
            min="0"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            placeholder="Score"
            required
            className="text-center"
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