import { Card, CardContent } from "@/components/ui/card";
import { GameInfo } from "./predictions/GameInfo";
import { PredictionDisplay } from "@/components/games/PredictionDisplay";
import { useState } from "react";
import { PointsBreakdownDialog } from "@/components/games/PointsBreakdownDialog";
import { Button } from "@/components/ui/button";
import { Eye, Share2 } from "lucide-react";
import { FinishedGameInsightsDialog } from "@/components/games/prediction/insights/FinishedGameInsightsDialog";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface UserPredictionCardProps {
  game: {
    id: string;
    game_date: string;
    home_team: {
      name: string;
      logo_url: string;
    };
    away_team: {
      name: string;
      logo_url: string;
    };
    game_results: Array<{
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
  isOwnPrediction?: boolean;
  userName?: string;
}

export function UserPredictionCard({ 
  game, 
  prediction, 
  isOwnPrediction = false,
  userName = "Anonymous"
}: UserPredictionCardProps) {
  const [showPointsBreakdown, setShowPointsBreakdown] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const gameResult = game.game_results[0];

  const handlePointsClick = () => {
    if (gameResult && prediction.points_earned !== undefined) {
      setShowPointsBreakdown(true);
    }
  };

  const handleShare = async () => {
    try {
      // Create a temporary container with proper styling
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.backgroundColor = "#ffffff"; // Always white for screenshots
      tempDiv.style.padding = "32px";
      tempDiv.style.borderRadius = "12px";
      tempDiv.style.width = "400px";
      tempDiv.style.boxSizing = "border-box";
      document.body.appendChild(tempDiv);

      // Create the card content
      const cardContent = document.createElement("div");
      cardContent.className = "relative";
      
      const originalContent = document.querySelector(`[data-game-id="${game.id}"]`);
      if (originalContent) {
        const clonedContent = originalContent.cloneNode(true) as HTMLElement;
        
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
          (name as HTMLElement).style.color = "#1a1a1a"; // Dark text for contrast
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
          (score as HTMLElement).style.color = "#1a1a1a"; // Dark text for contrast
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
              // Override dark mode text colors for better contrast in the screenshot
              el.style.color = el.classList.contains('text-muted-foreground') 
                ? '#666666' 
                : '#1a1a1a';
              // Remove dark mode background classes
              el.classList.remove('dark');
              if (el.classList.contains('bg-background')) {
                el.style.backgroundColor = '#ffffff';
              }
            }
          });
        }
        
        cardContent.innerHTML = clonedContent.innerHTML;
      }
      
      tempDiv.appendChild(cardContent);

      // Capture the screenshot with improved quality
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
  };

  return (
    <>
      <Card className="hover:shadow-md transition-all duration-300">
        <CardContent className="pt-6 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleShare}
            title="Share Prediction"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <div className="flex flex-col items-center" data-game-id={game.id}>
            <GameInfo game={game} prediction={prediction} />
            <div className="mt-4 space-y-3">
              <PredictionDisplay
                homeScore={prediction.prediction_home_score}
                awayScore={prediction.prediction_away_score}
                pointsEarned={prediction.points_earned}
                onClick={handlePointsClick}
                showBreakdownHint={!!gameResult && prediction.points_earned !== undefined}
                data-points-breakdown
              />
              
              {gameResult && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setShowInsights(true)}
                  data-insights-button
                >
                  <Eye className="w-4 h-4 mr-2" />
                  How Others Predicted
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {gameResult && prediction.points_earned !== undefined && (
        <PointsBreakdownDialog
          isOpen={showPointsBreakdown}
          onOpenChange={setShowPointsBreakdown}
          prediction={{
            prediction_home_score: prediction.prediction_home_score,
            prediction_away_score: prediction.prediction_away_score
          }}
          result={{
            home_score: gameResult.home_score,
            away_score: gameResult.away_score
          }}
          points={prediction.points_earned}
        />
      )}

      {gameResult && (
        <FinishedGameInsightsDialog
          isOpen={showInsights}
          onOpenChange={setShowInsights}
          gameId={game.id}
          finalScore={{
            home: gameResult.home_score,
            away: gameResult.away_score
          }}
        />
      )}
    </>
  );
}