import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserRoundPredictions } from "./predictions/useUserRoundPredictions";
import { UserPredictionCard } from "./UserPredictionCard";
import { RoundSelector } from "./predictions/RoundSelector";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserPredictionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

export function UserPredictionsDialog({ 
  isOpen, 
  onOpenChange, 
  userId,
  userName 
}: UserPredictionsDialogProps) {
  const [selectedRound, setSelectedRound] = useState("");
  const { data: predictions } = useUserRoundPredictions(userId, selectedRound, isOpen);

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();
      return data;
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Avatar>
                {userProfile?.avatar_url ? (
                  <AvatarImage src={userProfile.avatar_url} alt={userName} />
                ) : null}
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              {userName}'s Predictions
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <RoundSelector selectedRound={selectedRound} onRoundChange={setSelectedRound} />

          {selectedRound && predictions && (
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <UserPredictionCard
                  key={prediction.id}
                  game={prediction.game}
                  prediction={{
                    prediction_home_score: prediction.prediction.prediction_home_score,
                    prediction_away_score: prediction.prediction.prediction_away_score,
                    points_earned: prediction.prediction.points_earned
                  }}
                />
              ))}
              {predictions.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No predictions for this round
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}