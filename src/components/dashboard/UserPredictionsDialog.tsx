import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserRoundPredictions } from "./predictions/useUserRoundPredictions";
import { UserPredictionCard } from "./UserPredictionCard";
import { RoundSelector } from "./predictions/RoundSelector";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Check if this is the current round by comparing game dates with current date
  const isCurrentRound = predictions?.some(p => new Date(p.game.game_date) > new Date());

  const finishedPredictions = predictions?.filter(p => p.game.game_results?.length > 0) || [];
  const futurePredictions = predictions?.filter(p => !p.game.game_results?.length && new Date(p.game.game_date) > new Date()) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
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

        <div className="space-y-6 flex-1 overflow-y-auto">
          <RoundSelector selectedRound={selectedRound} onRoundChange={setSelectedRound} />

          {selectedRound && (
            <Tabs defaultValue="finished" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="finished">Finished Games</TabsTrigger>
                {isCurrentRound && (
                  <TabsTrigger value="future">Future Predictions</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="finished" className="space-y-4 mt-4">
                {finishedPredictions.map((prediction) => (
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
                {finishedPredictions.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No finished predictions for this round
                  </p>
                )}
              </TabsContent>

              {isCurrentRound && (
                <TabsContent value="future" className="space-y-4 mt-4">
                  {futurePredictions.map((prediction) => (
                    <UserPredictionCard
                      key={prediction.id}
                      game={prediction.game}
                      prediction={{
                        prediction_home_score: prediction.prediction.prediction_home_score,
                        prediction_away_score: prediction.prediction.prediction_away_score
                      }}
                    />
                  ))}
                  {futurePredictions.length === 0 && (
                    <p className="text-center text-muted-foreground">
                      No future predictions for this round
                    </p>
                  )}
                </TabsContent>
              )}
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}