import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-4">
        <div className="flex items-center justify-center">
          <img 
            src={homeTeam.logo_url} 
            alt={`${homeTeam.name} logo`}
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
          />
        </div>
        <div className="text-lg sm:text-2xl font-bold">
          {finalScore.home} - {finalScore.away}
        </div>
        <div className="flex items-center justify-center">
          <img 
            src={awayTeam.logo_url} 
            alt={`${awayTeam.name} logo`}
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
          />
        </div>
      </div>
      <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
        Game Insights
      </DialogTitle>
    </DialogHeader>
  );
}