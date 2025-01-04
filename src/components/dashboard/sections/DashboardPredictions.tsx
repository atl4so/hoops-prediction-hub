import { CollapsibleRoundSection } from "@/components/dashboard/CollapsibleRoundSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DashboardPredictionsProps {
  predictionsByRound: Record<string, {
    roundId: string;
    roundName: string;
    predictions: Array<{
      id: string;
      game: {
        id: string;
        game_date: string;
        round: {
          id: string;
          name: string;
        };
        home_team: {
          id: string;
          name: string;
          logo_url: string;
        };
        away_team: {
          id: string;
          name: string;
          logo_url: string;
        };
        game_results?: Array<{
          home_score: number;
          away_score: number;
          is_final: boolean;
        }>;
      };
      prediction: {
        prediction_home_score: number;
        prediction_away_score: number;
        points_earned?: number;
      } | null;
    }>;
  }>;
  userName: string;
}

export function DashboardPredictions({ predictionsByRound, userName }: DashboardPredictionsProps) {
  if (!predictionsByRound) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">My Predictions</h2>
      <div className="rounded-lg border">
        <Accordion type="single" collapsible className="w-full">
          {Object.values(predictionsByRound).map((roundData) => (
            <AccordionItem key={roundData.roundId} value={roundData.roundId}>
              <AccordionTrigger className="rounded-lg px-4 hover:no-underline data-[state=open]:bg-accent/50 hover:bg-accent/50">
                <span className="text-sm font-medium">
                  Round {roundData.roundName}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-4 px-4">
                <CollapsibleRoundSection
                  roundId={roundData.roundId}
                  roundName={roundData.roundName}
                  predictions={roundData.predictions}
                  userName={userName}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}