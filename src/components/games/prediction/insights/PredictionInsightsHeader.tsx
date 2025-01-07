import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface PredictionInsightsHeaderProps {
  homeTeam: {
    name: string;
    logo_url: string;
  };
  awayTeam: {
    name: string;
    logo_url: string;
  };
}

export function PredictionInsightsHeader({ homeTeam, awayTeam }: PredictionInsightsHeaderProps) {
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
          vs
        </div>
        <div className="flex items-center justify-center">
          <img 
            src={awayTeam.logo_url} 
            alt={`${awayTeam.name} logo`}
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
          />
        </div>
      </div>
      <DialogTitle className="text-2xl font-bold text-center">
        How Others Predict
      </DialogTitle>
    </DialogHeader>
  );
}