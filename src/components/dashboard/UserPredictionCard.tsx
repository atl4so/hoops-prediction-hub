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
import { ScreenshotContainer } from "./predictions/screenshot/ScreenshotContainer";
import { ScoreDisplay } from "./predictions/screenshot/ScoreDisplay";
import { TeamDisplay } from "./predictions/screenshot/TeamDisplay";

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
      const tempDiv = document.createElement("div");
      document.body.appendChild(tempDiv);

      const ScreenshotContent = () => (
        <ScreenshotContainer>
          <div className="space-y-4">
            <time className="block text-center text-lg text-gray-600">
              {new Date(game.game_date).toLocaleDateString()}
            </time>
            <div className="grid grid-cols-3 gap-4 items-center">
              <TeamDisplay name={game.home_team.name} logoUrl={game.home_team.logo_url} />
              <ScoreDisplay 
                homeScore={gameResult.home_score} 
                awayScore={gameResult.away_score} 
              />
              <TeamDisplay name={game.away_team.name} logoUrl={game.away_team.logo_url} />
            </div>
          </div>
        </ScreenshotContainer>
      );

      // Render the content
      const root = document.createElement('div');
      tempDiv.appendChild(root);
      
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