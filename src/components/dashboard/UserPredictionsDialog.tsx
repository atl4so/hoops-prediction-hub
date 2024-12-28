import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoundSelector } from "./predictions/RoundSelector";
import { UserPredictionsGrid } from "./predictions/UserPredictionsGrid";
import { useUserRoundPredictions } from "./predictions/useUserRoundPredictions";

interface UserPredictionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export function UserPredictionsDialog({
  isOpen,
  onClose,
  userId,
  userName,
}: UserPredictionsDialogProps) {
  const [selectedRound, setSelectedRound] = useState<string>("all");
  const queryClient = useQueryClient();

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isOpen) return;

    const channel = supabase
      .channel('game-results-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_results'
        },
        () => {
          console.log('Game results changed, invalidating queries...');
          queryClient.invalidateQueries({ queryKey: ['user-predictions', userId, selectedRound] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, userId, selectedRound, queryClient]);

  const { data: predictions, isLoading } = useUserRoundPredictions(userId, selectedRound, isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{userName}'s Predictions</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <RoundSelector 
            selectedRound={selectedRound} 
            onRoundChange={setSelectedRound} 
          />
          <UserPredictionsGrid 
            predictions={predictions} 
            isLoading={isLoading} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}