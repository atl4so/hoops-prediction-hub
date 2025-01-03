import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { PredictionsPreview } from "./PredictionsPreview";

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
  const handleDownload = async () => {
    try {
      // Create a temporary div to render our preview
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      // Render our preview component
      const root = document.createElement("div");
      root.style.width = "800px"; // Fixed width for consistent rendering
      root.style.backgroundColor = "white";
      root.style.padding = "20px";
      tempDiv.appendChild(root);

      // Create preview content
      const previewContent = <PredictionsPreview
        userName={userName}
        roundName={roundName}
        predictions={predictions}
      />;

      // Render the preview
      const { createRoot } = await import('react-dom/client');
      const reactRoot = createRoot(root);
      await new Promise<void>(resolve => {
        reactRoot.render(previewContent);
        setTimeout(resolve, 100); // Give time for rendering
      });

      // Capture the preview as an image
      const canvas = await html2canvas(root, {
        scale: 2, // Higher quality
        backgroundColor: "white",
      });

      // Convert to PNG and download
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `predictions-round-${roundName}.png`;
      link.href = image;
      link.click();

      // Cleanup
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
      size="sm"
      onClick={handleDownload}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Download Image
    </Button>
  );
};