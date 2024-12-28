import { Button } from "@/components/ui/button";
import { subHours } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface PredictionButtonProps {
  isAuthenticated: boolean;
  gameDate: string;
  onPrediction: () => void;
}

export function PredictionButton({ isAuthenticated, gameDate, onPrediction }: PredictionButtonProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const isPredictionAllowed = () => {
    const gameDateObj = new Date(gameDate);
    const now = new Date();
    const oneHourBefore = subHours(gameDateObj, 1);
    return now < oneHourBefore;
  };

  const handleClick = () => {
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

    onPrediction();
  };

  return (
    <Button 
      onClick={handleClick}
      className="w-full bg-primary/90 hover:bg-primary shadow-sm transition-all duration-300 font-medium tracking-wide"
      disabled={!isPredictionAllowed()}
      variant={isPredictionAllowed() ? "default" : "secondary"}
    >
      {isPredictionAllowed() ? "Make Prediction" : "Predictions Closed"}
    </Button>
  );
}