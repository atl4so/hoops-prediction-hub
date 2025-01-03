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

  const finishedPredictions = predictions?.filter(p => p.game.game_results?.length > 0) || [];
  
  console.log('Current time:', new Date().toISOString());
  console.log('All predictions:', predictions?.map(p => ({
    gameDate: p.game.game_date,
    isInFuture: new Date(p.game.game_date) > new Date(),
    hasResults: p.game.game_results?.length > 0
  })));

  const now = new Date();
  const futurePredictions = predictions?.filter(p => {
    const gameDate = new Date(p.game.game_date);
    return !p.game.game_results?.length && gameDate > now;
  }) || [];
  
  const upcomingGamesInRound = predictions?.some(p => {
    const gameDate = new Date(p.game.game_date);
    return gameDate > now;
  });
  
  const defaultTab = futurePredictions.length > 0 ? "future" : "finished";

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
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="finished" className="relative">
                  <span className="mr-6">Finished Games</span>
                  {finishedPredictions.length > 0 && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {finishedPredictions.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="future" className="relative">
                  <span className="mr-6">Upcoming Games</span>
                  {futurePredictions.length > 0 && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {futurePredictions.length}
                    </span>
                  )}
                </TabsTrigger>
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
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-lg mb-2">No Finished Games</p>
                    <p className="text-sm">Games will appear here once they are completed</p>
                  </div>
                )}
              </TabsContent>

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
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-lg mb-2">No Upcoming Games</p>
                    <p className="text-sm">
                      {upcomingGamesInRound 
                        ? "This user hasn't made predictions for upcoming games yet"
                        : "All games in this round have been completed"}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}