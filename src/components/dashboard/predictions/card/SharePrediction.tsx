import html2canvas from "html2canvas";
import { toast } from "sonner";

interface SharePredictionProps {
  gameId: string;
  content: HTMLElement | null;
}

export async function sharePrediction({ gameId, content }: SharePredictionProps) {
  try {
    if (!content) return;
    
    // Create a temporary container with proper styling
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.backgroundColor = "#ffffff";
    tempDiv.style.padding = "32px";
    tempDiv.style.borderRadius = "12px";
    tempDiv.style.width = "400px";
    tempDiv.style.boxSizing = "border-box";
    document.body.appendChild(tempDiv);

    // Clone and modify content
    const clonedContent = content.cloneNode(true) as HTMLElement;
    
    // Remove elements we don't want in the screenshot
    const insightsButton = clonedContent.querySelector('[data-insights-button]');
    const pointsBreakdown = clonedContent.querySelector('[data-points-breakdown]');
    const pointsInfo = clonedContent.querySelector('[data-points-info]');
    
    if (insightsButton) insightsButton.remove();
    if (pointsBreakdown) pointsBreakdown.remove();
    if (pointsInfo) pointsInfo.remove();
    
    // Enhanced styling for the screenshot
    const teamLogos = clonedContent.querySelectorAll('img');
    teamLogos.forEach(logo => {
      (logo as HTMLElement).style.width = "80px";
      (logo as HTMLElement).style.height = "80px";
      (logo as HTMLElement).style.objectFit = "contain";
    });

    const teamNames = clonedContent.querySelectorAll('.line-clamp-2');
    teamNames.forEach(name => {
      (name as HTMLElement).style.fontSize = "16px";
      (name as HTMLElement).style.lineHeight = "1.4";
      (name as HTMLElement).style.marginTop = "12px";
      (name as HTMLElement).style.fontWeight = "600";
      (name as HTMLElement).style.color = "#1a1a1a";
      (name as HTMLElement).style.textAlign = "center";
      (name as HTMLElement).style.minHeight = "auto";
      (name as HTMLElement).style.height = "auto";
      (name as HTMLElement).className = name.className.replace('line-clamp-2', '');
    });

    // Style the score/prediction display
    const scoreElements = clonedContent.querySelectorAll('.text-lg, .text-xl');
    scoreElements.forEach(score => {
      (score as HTMLElement).style.fontSize = "24px";
      (score as HTMLElement).style.fontWeight = "700";
      (score as HTMLElement).style.color = "#1a1a1a";
      (score as HTMLElement).style.margin = "16px 0";
    });

    // Style the date/time
    const dateElements = clonedContent.querySelectorAll('time');
    dateElements.forEach(date => {
      (date as HTMLElement).style.fontSize = "18px";
      (date as HTMLElement).style.color = "#4b5563";
      (date as HTMLElement).style.marginBottom = "16px";
      (date as HTMLElement).style.display = "block";
      (date as HTMLElement).style.textAlign = "center";
    });

    // Add dark mode specific styles
    if (document.documentElement.classList.contains('dark')) {
      const allElements = clonedContent.querySelectorAll('*');
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.color = el.classList.contains('text-muted-foreground') 
            ? '#666666' 
            : '#1a1a1a';
          el.classList.remove('dark');
          if (el.classList.contains('bg-background')) {
            el.style.backgroundColor = '#ffffff';
          }
        }
      });
    }

    tempDiv.appendChild(clonedContent);

    // Capture the screenshot
    const canvas = await html2canvas(tempDiv, {
      scale: 3,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    // Clean up
    document.body.removeChild(tempDiv);

    // Share or download
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), "image/png", 1.0);
    });

    if (navigator.share && navigator.canShare({ files: [new File([blob], "prediction.png", { type: "image/png" })] })) {
      await navigator.share({
        files: [new File([blob], "prediction.png", { type: "image/png" })],
        title: "My Prediction",
      });
      toast.success("Prediction shared successfully!");
    } else {
      // Fallback to download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "prediction.png";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Prediction downloaded successfully!");
    }
  } catch (error) {
    console.error("Error sharing prediction:", error);
    toast.error("Failed to share prediction. Please try again.");
  }
}