import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface GameStatsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  homeTeam: {
    name: string;
    logo_url: string;
  };
  awayTeam: {
    name: string;
    logo_url: string;
  };
}

export function GameStatsModal({
  isOpen,
  onOpenChange,
  gameId,
  homeTeam,
  awayTeam
}: GameStatsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center">
            Game Statistics
          </DialogTitle>
          <div className="flex items-center justify-center gap-4 mt-2">
            <img 
              src={homeTeam.logo_url} 
              alt={homeTeam.name} 
              className="w-12 h-12 object-contain"
            />
            <span className="text-lg font-semibold">vs</span>
            <img 
              src={awayTeam.logo_url} 
              alt={awayTeam.name} 
              className="w-12 h-12 object-contain"
            />
          </div>
        </DialogHeader>

        <Tabs defaultValue="team" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="team">Team Stats</TabsTrigger>
            <TabsTrigger value="player">Player Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="team" className="mt-4 space-y-4">
            <div className="space-y-4">
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-24" />
            </div>
          </TabsContent>
          <TabsContent value="player" className="mt-4">
            <div className="space-y-4">
              <Skeleton className="w-full h-32" />
              <Skeleton className="w-full h-32" />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}