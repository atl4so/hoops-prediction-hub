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
import { useState } from "react";

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
  const [isCapturing, setIsCapturing] = useState(false);

  const captureAndShare = async () => {
    try {
      setIsCapturing(true);
      toast.loading("Capturing screenshot...");

      // Wait for any images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = document.getElementById('predictions-preview');
      if (!element) {
        throw new Error("Preview element not found");
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (doc) => {
          const el = doc.getElementById('predictions-preview');
          if (el) {
            el.style.padding = '16px';
            el.style.borderRadius = '8px';
          }
        }
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create image blob"));
          }
        }, 'image/png', 1.0);
      });

      // Create file for sharing
      const file = new File([blob], `round-${roundName}-predictions.png`, { type: 'image/png' });

      // Try native sharing first
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Round ${roundName} Predictions`,
        });
        toast.success("Screenshot shared successfully!");
      } else {
        // Fallback to download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `round-${roundName}-predictions.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Screenshot downloaded successfully!");
      }
    } catch (error) {
      console.error('Screenshot error:', error);
      toast.error("Failed to capture screenshot. Please try again.");
    } finally {
      setIsCapturing(false);
      toast.dismiss();
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
      <DialogContent className="w-full p-2 sm:p-4 max-w-[95vw] sm:max-w-3xl dark:bg-gray-900">
        <DialogHeader className="mb-2 sm:mb-4">
          <div className="flex items-center justify-between gap-4 pr-8">
            <DialogTitle className="text-base sm:text-lg dark:text-white">Round {roundName} Summary</DialogTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={captureAndShare}
              disabled={isCapturing}
              className="shrink-0 dark:text-white dark:hover:text-white"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div id="predictions-preview" className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden w-full">
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