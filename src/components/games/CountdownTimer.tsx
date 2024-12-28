import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";

interface CountdownTimerProps {
  gameDate: string;
}

export function CountdownTimer({ gameDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const gameTime = new Date(gameDate);
      const diffInSeconds = differenceInSeconds(gameTime, now);
      
      if (diffInSeconds <= 0) {
        setTimeLeft("Game started");
        return;
      }

      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      
      if (hours > 24) {
        setTimeLeft(`${Math.floor(hours / 24)}d ${hours % 24}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [gameDate]);

  if (!timeLeft || timeLeft === "Game started") return null;

  return (
    <div className="text-xs font-medium text-orange-500 animate-pulse">
      Starts in {timeLeft}
    </div>
  );
}