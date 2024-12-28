import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface GameCardProps {
  game: {
    id: string;
    game_date: string;
    home_team: { name: string };
    away_team: { name: string };
  };
  isAuthenticated: boolean;
}

export function GameCard({ game, isAuthenticated }: GameCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    // Navigate to prediction page (to be implemented)
    navigate(`/predictions/${game.id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {game.home_team.name} vs {game.away_team.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {format(new Date(game.game_date), "PPP")} at{" "}
          {format(new Date(game.game_date), "p")}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePrediction}
          className="w-full"
        >
          Make Prediction
        </Button>
      </CardFooter>
    </Card>
  );
}