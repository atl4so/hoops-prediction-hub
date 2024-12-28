import { Button } from "@/components/ui/button";
import { subHours, isAfter, isBefore } from "date-fns";
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
    
    // For debugging
    console.log('Game date:', gameDateObj);
    console.log('Current time:', now);
    console.log('One hour before:', oneHourBefore);
    
    // Allow predictions if:
    // 1. Current time is before the game start time AND
    // 2. Current time is before the cutoff time (1 hour before game)
    const isBeforeGame = isBefore(now, gameDateObj);
    const isBeforeCutoff = isBefore(now, oneHourBefore);
    
    console.log('Is before game:', isBeforeGame);
    console.log('Is before cutoff:', isBeforeCutoff);
    console.log('Is prediction allowed:', isBeforeGame && isBeforeCutoff);
    
    return isBeforeGame && isBeforeCutoff;
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
      className={`w-full shadow-sm transition-all duration-300 font-medium tracking-wide ${
        isPredictionAllowed() 
          ? "bg-primary/90 hover:bg-primary" 
          : "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
      }`}
      disabled={!isPredictionAllowed()}
      variant={isPredictionAllowed() ? "default" : "secondary"}
    >
      {isPredictionAllowed() ? "Make Prediction" : "Predictions Closed"}
    </Button>
  );
}