import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RoundSelector } from "../predictions/RoundSelector";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { THRESHOLDS } from "./constants";
import { EmptyPredictionState } from "./EmptyPredictionState";
import { ThresholdTabsContent } from "./ThresholdTabsContent";
import type { PredictionData } from "./types";

interface OverUnderPredictionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function OverUnderPredictionsDialog({
  isOpen,
  onOpenChange,
  userId,
}: OverUnderPredictionsDialogProps) {
  const [selectedRound, setSelectedRound] = useState("");
  const [selectedThreshold, setSelectedThreshold] = useState(THRESHOLDS[0].toString());

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['round-over-under-predictions', userId, selectedRound],
    queryFn: async () => {
      if (!selectedRound) return [];
      
      console.log('Fetching over/under predictions for round:', selectedRound);
      
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          id,
          prediction_home_score,
          prediction_away_score,
          game:games!inner (
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey (
              name
            ),
            away_team:teams!games_away_team_id_fkey (
              name
            ),
            game_results!inner (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .eq('user_id', userId)
        .eq('game.round_id', selectedRound);

      if (error) {
        console.error('Error fetching predictions:', error);
        throw error;
      }

      return data.filter(pred => pred.game.game_results.is_final) as PredictionData[];
    },
    enabled: isOpen && !!selectedRound,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Over/Under Predictions by Threshold</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Select different thresholds to see your prediction accuracy for games above or below that total score.
            </p>
            <Alert variant="destructive" className="mt-2">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Important: For each threshold, your prediction must be clearly over or under. 
                Predicting exactly the threshold value will be marked as incorrect.
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <RoundSelector 
            selectedRound={selectedRound} 
            onRoundChange={setSelectedRound}
            className="w-full"
          />

          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading predictions...
            </div>
          ) : predictions && predictions.length > 0 ? (
            <Tabs value={selectedThreshold} onValueChange={setSelectedThreshold}>
              <TabsList className="grid grid-cols-8 w-full">
                {THRESHOLDS.map((threshold) => (
                  <TabsTrigger 
                    key={threshold} 
                    value={threshold.toString()}
                    className="text-xs sm:text-sm"
                  >
                    {threshold}
                  </TabsTrigger>
                ))}
              </TabsList>

              {THRESHOLDS.map((threshold) => (
                <ThresholdTabsContent 
                  key={threshold}
                  threshold={threshold}
                  predictions={predictions}
                />
              ))}
            </Tabs>
          ) : (
            <EmptyPredictionState selectedRound={selectedRound} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}