import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface GameStatsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  homeTeam: string;
  awayTeam: string;
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
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center">
            {homeTeam} vs {awayTeam}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="home">Home Team</TabsTrigger>
            <TabsTrigger value="away">Away Team</TabsTrigger>
            <TabsTrigger value="info">Game Info</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 overflow-auto">
            <div className="space-y-4">
              <Skeleton className="h-[200px]" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-[100px]" />
                <Skeleton className="h-[100px]" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="home" className="flex-1 overflow-auto">
            <Skeleton className="h-[400px]" />
          </TabsContent>

          <TabsContent value="away" className="flex-1 overflow-auto">
            <Skeleton className="h-[400px]" />
          </TabsContent>

          <TabsContent value="info" className="flex-1 overflow-auto">
            <Skeleton className="h-[200px]" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}