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

  const handleDialogClose = (open: boolean) => {
    setShowDialog(open);
    if (!open) {
      setSelectedRound("");
    }
  };

  return (
    <>
      <Card className="bg-[#1A1F2C]/5 backdrop-blur-sm border-[#9b87f5]/20">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2 text-[#1A1F2C]">
            <div className="flex items-center gap-1">
              <Home className="h-5 w-5 text-[#9b87f5]" />
              <Plane className="h-5 w-5 text-[#7E69AB]" />
            </div>
            Winner Predictions by Round
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RoundSelector
            selectedRound={selectedRound}
            onRoundChange={handleRoundChange}
            className="w-full bg-white border-[#9b87f5]/20"
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