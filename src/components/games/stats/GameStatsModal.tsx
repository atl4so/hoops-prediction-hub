import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGameStats } from "@/hooks/useGameStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface GameStatsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
}

export function GameStatsModal({ isOpen, onOpenChange, gameId }: GameStatsModalProps) {
  const { stats, isLoading, error } = useGameStats(gameId);

  const StatRow = ({ label, home, away }: { label: string; home: number; away: number }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b last:border-0">
      <div className="text-right font-medium">{home}</div>
      <div className="text-center text-sm text-muted-foreground">{label}</div>
      <div className="text-left font-medium">{away}</div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Game Statistics</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {error && (
            <Card className="p-4">
              <p className="text-center text-red-500">{error}</p>
            </Card>
          )}

          {stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="font-semibold">{stats.localTeam.name}</div>
                <div className="text-2xl font-bold">
                  {stats.localTeam.score} - {stats.awayTeam.score}
                </div>
                <div className="font-semibold">{stats.awayTeam.name}</div>
              </div>

              <div className="space-y-2">
                <StatRow 
                  label="Field Goal %" 
                  home={Math.round(stats.localTeam.stats.fieldGoalsPercent)} 
                  away={Math.round(stats.awayTeam.stats.fieldGoalsPercent)} 
                />
                <StatRow 
                  label="3PT %" 
                  home={Math.round(stats.localTeam.stats.threePointsPercent)} 
                  away={Math.round(stats.awayTeam.stats.threePointsPercent)} 
                />
                <StatRow 
                  label="Free Throw %" 
                  home={Math.round(stats.localTeam.stats.freeThrowsPercent)} 
                  away={Math.round(stats.awayTeam.stats.freeThrowsPercent)} 
                />
                <StatRow 
                  label="Rebounds" 
                  home={stats.localTeam.stats.rebounds} 
                  away={stats.awayTeam.stats.rebounds} 
                />
                <StatRow 
                  label="Assists" 
                  home={stats.localTeam.stats.assists} 
                  away={stats.awayTeam.stats.assists} 
                />
                <StatRow 
                  label="Steals" 
                  home={stats.localTeam.stats.steals} 
                  away={stats.awayTeam.stats.steals} 
                />
                <StatRow 
                  label="Blocks" 
                  home={stats.localTeam.stats.blocks} 
                  away={stats.awayTeam.stats.blocks} 
                />
                <StatRow 
                  label="Turnovers" 
                  home={stats.localTeam.stats.turnovers} 
                  away={stats.awayTeam.stats.turnovers} 
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}