import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
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

export function RoundSummaryDialog({ roundName, userName, predictions }: RoundSummaryDialogProps) {
  const captureScreenshot = async () => {
    try {
      const element = document.getElementById('predictions-preview');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1200, // Force desktop layout for consistent screenshots
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('predictions-preview');
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.width = '100%';
          }
        }
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Failed to create image");
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `round-${roundName}-predictions.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success("Screenshot saved!");
      }, 'image/png');
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
      <DialogContent className="max-w-3xl p-2 sm:p-4">
        <DialogHeader className="mb-2 sm:mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base sm:text-lg">Round {roundName} Summary</DialogTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={captureScreenshot}
              className="ml-2 sm:ml-4"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Save as Image
            </Button>
          </div>
        </DialogHeader>
        <div id="predictions-preview" className="bg-white rounded-lg overflow-hidden">
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