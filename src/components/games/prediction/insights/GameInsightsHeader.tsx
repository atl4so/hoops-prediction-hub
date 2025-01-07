import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TeamDisplay } from "@/components/games/TeamDisplay";
import { useIsMobile } from "@/hooks/use-mobile";

interface GameInsightsHeaderProps {
  homeTeam: {
    name: string;
    logo_url: string;
  };
  awayTeam: {
    name: string;
    logo_url: string;
  };
  finalScore: {
    home: number;
    away: number;
  };
}

export function GameInsightsHeader({ homeTeam, awayTeam, finalScore }: GameInsightsHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <DialogHeader>
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-4">
        <TeamDisplay 
          team={homeTeam} 
          className={isMobile ? "w-12" : "w-16"}
          imageClassName="w-8 h-8 sm:w-12 sm:h-12"
        />
        <div className="text-lg sm:text-2xl font-bold">
          {finalScore.home} - {finalScore.away}
        </div>
        <TeamDisplay 
          team={awayTeam} 
          className={isMobile ? "w-12" : "w-16"}
          imageClassName="w-8 h-8 sm:w-12 sm:h-12"
        />
      </div>
      <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
        Game Insights
      </DialogTitle>
    </DialogHeader>
  );
}