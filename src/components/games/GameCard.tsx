import { format, subHours } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PredictionDialog } from "@/components/predictions/PredictionDialog";

interface GameCardProps {
  game: {
    id: string;
    game_date: string;
    home_team: { name: string; logo_url: string };
    away_team: { name: string; logo_url: string };
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
      <Card className="w-full group hover:shadow-lg transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-background to-background/95 border-primary/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative">
              {/* Home Team */}
              <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                <div className="relative w-12 h-12 rounded-full bg-background/50 p-2 shadow-sm">
                  <img 
                    src={game.home_team.logo_url} 
                    alt={`${game.home_team.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-display tracking-tight">{game.home_team.name}</span>
              </div>

              {/* VS Badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:block">
                <span className="px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  VS
                </span>
              </div>

              {/* Away Team */}
              <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                <span className="font-display tracking-tight">{game.away_team.name}</span>
                <div className="relative w-12 h-12 rounded-full bg-background/50 p-2 shadow-sm">
                  <img 
                    src={game.away_team.logo_url} 
                    alt={`${game.away_team.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            {format(new Date(game.game_date), "PPP")} at{" "}
            {format(new Date(game.game_date), "p")}
          </p>
        </CardContent>

        <CardFooter className="pb-6">
          <Button 
            onClick={handlePrediction}
            className="w-full bg-primary/90 hover:bg-primary shadow-sm transition-all duration-300 font-medium tracking-wide"
            disabled={!isPredictionAllowed()}
          >
            {isPredictionAllowed() ? "Make Prediction" : "Predictions Closed"}
          </Button>
        </CardFooter>
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