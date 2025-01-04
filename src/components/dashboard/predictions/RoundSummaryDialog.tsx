import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { PredictionsPreview } from "../PredictionsPreview";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface RoundSummaryDialogProps {
  roundName: string;
  userName: string;
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

export function RoundSummaryDialog({ 
  roundName, 
  userName, 
  predictions 
}: RoundSummaryDialogProps) {
  const captureScreenshot = async () => {
    try {
      const element = document.getElementById('predictions-preview');
      if (!element) {
        toast.error("Could not find predictions preview");
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true,
      });

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Failed to create image");
          return;
        }

        try {
          // Try to use the Share API if available
          if (navigator.share) {
            const file = new File([blob], `round-${roundName}-predictions.png`, { type: 'image/png' });
            await navigator.share({
              files: [file],
            });
          } else {
            // Fallback to download if Share API is not available
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `round-${roundName}-predictions.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
          toast.success("Screenshot captured!");
        } catch (error) {
          console.error('Share error:', error);
          toast.error("Failed to share screenshot");
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Screenshot error:', error);
      toast.error("Failed to capture screenshot");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Share2 className="h-4 w-4 mr-2" />
          Share Round
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full p-2 sm:p-4 max-w-[95vw] sm:max-w-3xl">
        <DialogHeader className="mb-2 sm:mb-4">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-base sm:text-lg">Round {roundName} Summary</DialogTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={captureScreenshot}
              className="shrink-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div id="predictions-preview" className="bg-white rounded-lg overflow-hidden w-full">
          <PredictionsPreview
            userName={userName}
            roundName={roundName}
            predictions={predictions}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}