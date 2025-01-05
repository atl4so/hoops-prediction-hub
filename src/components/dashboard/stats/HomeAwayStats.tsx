import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoundSelector } from "../predictions/RoundSelector";
import { useState } from "react";
import { HomeAwayPredictionsDialog } from "./HomeAwayPredictionsDialog";

interface HomeAwayStatsProps {
  userId?: string | null;
}

export function HomeAwayStats({ userId }: HomeAwayStatsProps) {
  const [selectedRound, setSelectedRound] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const handleRoundChange = (roundId: string) => {
    if (roundId) {
      setSelectedRound(roundId);
      setShowDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setSelectedRound("");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Winner Predictions by Round</CardTitle>
        </CardHeader>
        <CardContent>
          <RoundSelector
            selectedRound={selectedRound}
            onRoundChange={handleRoundChange}
            className="w-full bg-white"
          />
        </CardContent>
      </Card>

      {userId && (
        <HomeAwayPredictionsDialog
          isOpen={showDialog}
          onOpenChange={handleDialogClose}
          userId={userId}
          roundId={selectedRound}
        />
      )}
    </>
  );
}