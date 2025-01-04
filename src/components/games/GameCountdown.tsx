import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface GameCountdownProps {
  gameDate: string;
}

export function GameCountdown({ gameDate }: GameCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    progress: number;
    days: number;
  }>({ hours: 0, minutes: 0, seconds: 0, progress: 0, days: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const gameTime = new Date(gameDate).getTime();
      const now = new Date().getTime();
      const difference = gameTime - now;

      // 24 hours in milliseconds
      const totalDuration = 24 * 60 * 60 * 1000;
      const elapsed = totalDuration - difference;
      const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        return { hours, minutes, seconds, progress, days };
      }
      return { hours: 0, minutes: 0, seconds: 0, progress: 100, days: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [gameDate]);

  const formatTimeDisplay = () => {
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h`;
    }
    return `${timeLeft.hours}h ${timeLeft.minutes}m`;
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs text-muted-foreground">Time to game</p>
      <Progress value={timeLeft.progress} className="h-2 w-24" />
      <p className="text-xs text-muted-foreground">
        {formatTimeDisplay()}
      </p>
    </div>
  );
}