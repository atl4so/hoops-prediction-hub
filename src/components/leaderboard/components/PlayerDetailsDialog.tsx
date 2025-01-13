import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import { UserPredictionsDialog } from "@/components/dashboard/UserPredictionsDialog";
import { BestTeamsPredictions } from "@/components/dashboard/stats/BestTeamsPredictions";
import { WorstTeamsPredictions } from "@/components/dashboard/stats/WorstTeamsPredictions";

interface PlayerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: {
    user_id?: string;
    display_name: string;
    avatar_url?: string;
    total_points: number;
    total_predictions: number;
    winner_predictions_correct?: number;
    winner_predictions_total?: number;
    ppg?: number;
    efficiency?: number;
    underdog_picks?: number;
  };
  rank: number;
  isRoundLeaderboard?: boolean;
  roundId?: string;
}

export function PlayerDetailsDialog({
  open,
  onOpenChange,
  player,
  rank,
}: PlayerDetailsDialogProps) {
  const [showPredictions, setShowPredictions] = useState(false);

  const StatCard = ({ title, value, description }: { title: string; value: string | number; description: string }) => (
    <Card className="p-4 space-y-2 bg-muted/50">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Card>
  );

  const calculateWinnerPercentage = () => {
    if (!player.winner_predictions_correct || !player.winner_predictions_total) return "0%";
    const percentage = Math.round((player.winner_predictions_correct / player.winner_predictions_total) * 100);
    return `${percentage}% (${player.winner_predictions_correct}/${player.winner_predictions_total})`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl h-[90vh] flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={player.avatar_url} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{player.display_name}</h3>
                  <p className="text-sm text-muted-foreground">Rank {rank}</p>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-1">
            <div className="py-6 space-y-6">
              <div className="flex gap-2 justify-between">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowPredictions(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Predictions
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard 
                  title="Total Points" 
                  value={player.total_points}
                  description="Total points earned from all predictions"
                />
                <StatCard 
                  title="Points per Game" 
                  value={player.ppg?.toFixed(1) || '0.0'}
                  description="Average points earned per prediction"
                />
                <StatCard 
                  title="Winner %" 
                  value={calculateWinnerPercentage()}
                  description="Percentage of correct winner predictions"
                />
                <StatCard 
                  title="Total Predictions" 
                  value={player.total_predictions}
                  description="Total number of predictions made"
                />
              </div>

              {player.user_id && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BestTeamsPredictions userId={player.user_id} />
                    <WorstTeamsPredictions userId={player.user_id} />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {player.user_id && (
        <UserPredictionsDialog
          isOpen={showPredictions}
          onOpenChange={setShowPredictions}
          userId={player.user_id}
          userName={player.display_name}
        />
      )}
    </>
  );
}