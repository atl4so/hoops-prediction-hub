import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import { PredictionsPDF } from "./PredictionsPDF";
import { toast } from "sonner";

interface DownloadPredictionsButtonProps {
  userName: string;
  userAvatar?: string;
  roundName: string;
  predictions: Array<{
    game: {
      game_date: string;
      home_team: {
        name: string;
        logo_url: string;
      };
      away_team: {
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
    };
  }>;
}

export const DownloadPredictionsButton = ({
  userName,
  userAvatar,
  roundName,
  predictions,
}: DownloadPredictionsButtonProps) => {
  const handleDownload = async () => {
    try {
      // Clean image URLs by removing query parameters
      const cleanedPredictions = predictions.map(pred => ({
        ...pred,
        game: {
          ...pred.game,
          home_team: {
            ...pred.game.home_team,
            logo_url: pred.game.home_team.logo_url.replace(/\?.*$/, '')
          },
          away_team: {
            ...pred.game.away_team,
            logo_url: pred.game.away_team.logo_url.replace(/\?.*$/, '')
          }
        }
      }));

      const cleanedAvatar = userAvatar?.replace(/\?.*$/, '');
      
      const blob = await pdf(
        <PredictionsPDF
          userName={userName}
          userAvatar={cleanedAvatar}
          roundName={roundName}
          predictions={cleanedPredictions}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `predictions-round-${roundName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Predictions downloaded successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to download predictions. Please try again.");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </Button>
  );
};