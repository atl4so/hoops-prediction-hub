import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { PredictionsPreview } from "./PredictionsPreview";
import { useIsMobile } from "@/hooks/use-mobile";

interface DownloadPredictionsButtonProps {
  userName: string;
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
  roundName,
  predictions,
}: DownloadPredictionsButtonProps) => {
  const isMobile = useIsMobile();

  const handleDownload = async () => {
    try {
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "1200px";
      tempDiv.style.backgroundColor = "#ffffff";
      document.body.appendChild(tempDiv);

      const { createRoot } = await import('react-dom/client');
      const reactRoot = createRoot(tempDiv);
      
      await new Promise<void>(resolve => {
        reactRoot.render(
          <PredictionsPreview
            userName={userName}
            roundName={roundName}
            predictions={predictions}
          />
        );
        setTimeout(resolve, 2000);
      });

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 1200,
        height: tempDiv.offsetHeight,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `predictions-round-${roundName.toLowerCase()}.png`;
      link.href = image;
      link.click();

      document.body.removeChild(tempDiv);
      toast.success("Predictions image downloaded successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to download predictions. Please try again.");
    }
  };

  return (
    <Button
      variant="outline"
      size={isMobile ? "icon" : "sm"}
      onClick={handleDownload}
      className={isMobile ? "w-8 h-8 p-0" : "gap-2"}
      title="Download Image"
    >
      <Download className="h-4 w-4" />
      {!isMobile && "Download Image"}
    </Button>
  );
};