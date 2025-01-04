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
import { ScrollArea } from "@/components/ui/scroll-area";
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
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        width: element.scrollWidth,
        height: element.scrollHeight
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
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Round {roundName} Summary</DialogTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={captureScreenshot}
              className="ml-4"
            >
              <Download className="h-4 w-4 mr-2" />
              Save as Image
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="p-6 pt-4">
            <div id="predictions-preview" className="bg-white rounded-lg overflow-hidden">
              <PredictionsPreview
                userName={userName}
                roundName={roundName}
                predictions={predictions}
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}