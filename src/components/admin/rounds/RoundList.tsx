import { Button } from "@/components/ui/button";
import { format, isValid } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";

interface Round {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

interface RoundListProps {
  rounds: Round[];
  onEdit: (round: Round) => void;
  onDelete: (id: string) => void;
  isDeletingId?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return isValid(date) ? format(date, "PPP") : "Invalid date";
};

export function RoundList({ rounds, onEdit, onDelete, isDeletingId }: RoundListProps) {
  return (
    <div className="space-y-4">
      {rounds.map((round) => (
        <div
          key={round.id}
          className="flex items-center justify-between p-4 border rounded-lg bg-card"
        >
          <div>
            <h4 className="font-medium">{round.name}</h4>
            <p className="text-sm text-muted-foreground">
              {formatDate(round.start_date)} - {formatDate(round.end_date)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(round)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(round.id)}
              disabled={isDeletingId === round.id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}