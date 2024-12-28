import { useEffect, useState } from "react";
import { UserPredictionCard } from "./UserPredictionCard";

interface CollapsibleRoundSectionProps {
  roundId: string;
  roundName: string;
  predictions: Array<any>;
  userId: string | null;
}

export function CollapsibleRoundSection({
  roundId,
  predictions,
  userId,
}: CollapsibleRoundSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {predictions.map((prediction: any) => (
          <UserPredictionCard
            key={prediction.id}
            prediction={prediction}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
}