import { format, subHours } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PredictionDialog } from "@/components/predictions/PredictionDialog";

interface GameCardProps {
  game: {
    id: string;
    game_date: string;
    home_team: { name: string; logo_url: string };
    away_team: { name: string; logo_url: string };
    round: { name: string };
  };
  isAuthenticated: boolean;
  userId?: string;
}

export function GameCard({ game, isAuthenticated, userId }: GameCardProps) {
  const [isPredictionOpen, setIsPredictionOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isPredictionAllowed = () => {
    const gameDate = new Date(game.game_date);
    const now = new Date();
    const oneHourBefore = subHours(gameDate, 1);
    return now < oneHourBefore;
  };

  const handlePrediction = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to make predictions",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!isPredictionAllowed()) {
      toast({
        title: "Predictions closed",
        description: "Predictions are closed 1 hour before the game starts",
        variant: "destructive",
      });
      return;
    }

    setIsPredictionOpen(true);
  };

  return (
    <>
      <Card className="w-full bg-card/50 backdrop-blur-sm border-primary/5 hover:border-primary/10 transition-all duration-300">
        <CardHeader className="p-4">
          <div className="flex flex-col space-y-4">
            {/* Round Name */}
            <div className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
              {game.round?.name}
            </div>
            
            {/* Teams */}
            <div className="flex items-center justify-between gap-2 relative">
              {/* Home Team */}
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-12 h-12 rounded-full bg-background/80 p-2 shadow-sm">
                  <img 
                    src={game.home_team.logo_url} 
                    alt={`${game.home_team.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-display text-sm sm:text-base font-semibold tracking-tight">
                  {game.home_team.name}
                </span>
              </div>

              {/* VS Badge */}
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary/80">
                VS
              </div>

              {/* Away Team */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                <span className="font-display text-sm sm:text-base font-semibold tracking-tight">
                  {game.away_team.name}
                </span>
                <div className="relative w-12 h-12 rounded-full bg-background/80 p-2 shadow-sm">
                  <img 
                    src={game.away_team.logo_url} 
                    alt={`${game.away_team.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="text-sm text-muted-foreground text-center">
              {format(new Date(game.game_date), "PPP")} at{" "}
              {format(new Date(game.game_date), "p")}
            </div>

            {/* Prediction Button */}
            <Button 
              onClick={handlePrediction}
              className="w-full bg-primary/90 hover:bg-primary shadow-sm transition-all duration-300 font-medium tracking-wide"
              disabled={!isPredictionAllowed()}
              variant={isPredictionAllowed() ? "default" : "secondary"}
            >
              {isPredictionAllowed() ? "Make Prediction" : "Predictions Closed"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isAuthenticated && userId && (
        <PredictionDialog
          game={game}
          isOpen={isPredictionOpen}
          onClose={() => setIsPredictionOpen(false)}
          userId={userId}
        />
      )}
    </>
  );
}