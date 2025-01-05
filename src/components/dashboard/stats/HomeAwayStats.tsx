import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoundSelector } from "../predictions/RoundSelector";
import { useState } from "react";
import { HomeAwayPredictionsDialog } from "./HomeAwayPredictionsDialog";
import { Home, Plane } from "lucide-react";

interface HomeAwayStatsProps {
  userId?: string | null;
}

export function HomeAwayStats({ userId }: HomeAwayStatsProps) {
  const [selectedRound, setSelectedRound] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const handleRoundChange = (roundId: string) => {
    setSelectedRound(roundId);
    setShowDialog(true);
  };

  return (
    <>
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Home className="h-5 w-5" />
              <Plane className="h-5 w-5" />
            </div>
            Winner Predictions by Round
          </CardTitle>
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
          onOpenChange={setShowDialog}
          userId={userId}
          roundId={selectedRound}
        />
      )}
    </>
  );
}