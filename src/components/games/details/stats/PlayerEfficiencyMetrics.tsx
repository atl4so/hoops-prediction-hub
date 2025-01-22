import { cn } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface PlayerStats {
  TimePlayed: string;
  Score: number;
  FieldGoalsMade2: number;
  FieldGoalsAttempted2: number;
  FieldGoalsMade3: number;
  FieldGoalsAttempted3: number;
  FreeThrowsMade: number;
  FreeThrowsAttempted: number;
  OffensiveRebounds: number;
  DefensiveRebounds: number;
  TotalRebounds: number;
  Assistances: number;
  Steals: number;
  BlocksFavour: number;
  Turnovers: number;
  Valuation: number;
}

interface PlayerEfficiencyMetricsProps {
  stats: PlayerStats;
  teamTotals: {
    Score: number;
    Assistances: number;
    TotalRebounds: number;
  };
}

export function PlayerEfficiencyMetrics({ stats, teamTotals }: PlayerEfficiencyMetricsProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsOpen(false);
    }
  };

  // Time conversion helper
  const getMinutes = (time: string) => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes + (seconds / 60);
  };

  const minutes = getMinutes(stats.TimePlayed);
  
  // Only calculate per minute stats if player has played at least 30 seconds
  const hasMinimumTime = minutes >= 0.5;

  // Basic per minute stats
  const pirPerMinute = hasMinimumTime ? (stats.Valuation / minutes).toFixed(2) : "0.00";
  const pointsPerMinute = hasMinimumTime ? (stats.Score / minutes).toFixed(2) : "0.00";
  const reboundsPerMinute = hasMinimumTime ? (stats.TotalRebounds / minutes).toFixed(2) : "0.00";
  const defensiveStats = hasMinimumTime ? ((stats.Steals + stats.BlocksFavour) / minutes).toFixed(2) : "0.00";

  // Shooting efficiency
  const fieldGoalAttempts = stats.FieldGoalsAttempted2 + stats.FieldGoalsAttempted3;
  const fieldGoalsMade = stats.FieldGoalsMade2 + stats.FieldGoalsMade3;
  const shootingEfficiency = fieldGoalAttempts > 0 
    ? ((fieldGoalsMade * 100) / fieldGoalAttempts).toFixed(1) 
    : "0.0";

  // True shooting attempts = FGA + (0.44 * FTA)
  const trueShootingAttempts = fieldGoalAttempts + (0.44 * stats.FreeThrowsAttempted);
  const points = stats.Score;
  const trueShootingPercentage = trueShootingAttempts > 0
    ? ((points / (2 * trueShootingAttempts)) * 100).toFixed(1)
    : "0.0";

  // Team impact percentages
  const scoringImpact = teamTotals.Score > 0 
    ? ((stats.Score / teamTotals.Score) * 100).toFixed(1) 
    : "0.0";
  const assistImpact = teamTotals.Assistances > 0
    ? ((stats.Assistances / teamTotals.Assistances) * 100).toFixed(1)
    : "0.0";
  const reboundImpact = teamTotals.TotalRebounds > 0
    ? ((stats.TotalRebounds / teamTotals.TotalRebounds) * 100).toFixed(1)
    : "0.0";

  // Ball security and playmaking
  const assistToTurnover = stats.Turnovers > 0 
    ? (stats.Assistances / stats.Turnovers).toFixed(2)
    : stats.Assistances > 0 ? "∞" : "0.00";

  // Floor impact
  const floorImpact = hasMinimumTime
    ? ((stats.Score + stats.TotalRebounds + stats.Assistances) / minutes).toFixed(2)
    : "0.00";

  // Calculate Euroleague.bet Performance Index
  const calculatePerformanceIndex = () => {
    if (!hasMinimumTime) return 0;

    const shootingEfficiencyWeight = 0.3;
    const playMakingWeight = 0.25;
    const defenseWeight = 0.25;
    const impactWeight = 0.2;

    // Shooting Efficiency Component (30%)
    const shootingEfficiency = fieldGoalAttempts > 0 
      ? ((fieldGoalsMade * 100) / fieldGoalAttempts) * (stats.Score / minutes)
      : 0;

    // Playmaking Component (25%)
    const playmaking = (stats.Assistances / minutes) * 10 + 
                      (stats.Turnovers === 0 ? 10 : stats.Assistances / stats.Turnovers);

    // Defense Component (25%)
    const defense = ((stats.Steals + stats.BlocksFavour) / minutes) * 10 +
                   (stats.TotalRebounds / minutes) * 5;

    // Team Impact Component (20%)
    const impact = (
      (stats.Score / teamTotals.Score) * 100 +
      (stats.Assistances / teamTotals.Assistances) * 100 +
      (stats.TotalRebounds / teamTotals.TotalRebounds) * 100
    ) / 3;

    const performanceIndex = (
      (shootingEfficiency * shootingEfficiencyWeight) +
      (playmaking * playMakingWeight) +
      (defense * defenseWeight) +
      (impact * impactWeight)
    );

    return performanceIndex.toFixed(2);
  };

  const performanceIndex = calculatePerformanceIndex();

  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="space-y-1">
        <StatItem 
          label="EL.bet Index" 
          value={performanceIndex}
          tooltip="Euroleague.bet Performance Index - Combines shooting efficiency (30%), playmaking (25%), defense (25%), and team impact (20%) into a single rating"
        />
        <StatItem 
          label="PIR/m" 
          value={pirPerMinute}
          tooltip="Performance Index Rating per minute - Overall efficiency rating normalized by playing time"
        />
        <StatItem 
          label="PTS/m" 
          value={pointsPerMinute}
          tooltip="Points scored per minute of play"
        />
        <StatItem 
          label="REB/m" 
          value={reboundsPerMinute}
          tooltip="Total rebounds (offensive + defensive) per minute"
        />
        <StatItem 
          label="DEF/m" 
          value={defensiveStats}
          tooltip="Combined defensive actions (steals + blocks) per minute"
        />
        <StatItem 
          label="Floor Impact" 
          value={floorImpact}
          tooltip="Combined contribution (points + rebounds + assists) per minute"
        />
      </div>
      <div className="space-y-1">
        <StatItem 
          label="FG%" 
          value={`${shootingEfficiency}%`}
          tooltip="Field Goal Percentage - (Made shots / Attempted shots) × 100"
        />
        <StatItem 
          label="TS%" 
          value={`${trueShootingPercentage}%`}
          tooltip="True Shooting Percentage - Points per shooting possession, accounting for 2PT, 3PT, and FT"
        />
        <StatItem 
          label="PTS%" 
          value={`${scoringImpact}%`}
          tooltip="Percentage of team's total points scored by the player"
        />
        <StatItem 
          label="AST%" 
          value={`${assistImpact}%`}
          tooltip="Percentage of team's total assists by the player"
        />
        <StatItem 
          label="AST/TO" 
          value={assistToTurnover}
          tooltip="Assist to Turnover ratio - Higher values indicate better ball security"
        />
      </div>
    </div>
  );
}

function StatItem({ label, value, tooltip }: { label: string; value: string; tooltip: string }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip 
        open={isMobile ? isOpen : undefined}
        onOpenChange={setIsOpen}
      >
        <TooltipTrigger asChild>
          <button 
            className={cn(
              "w-full flex justify-between items-center gap-1 px-1 py-0.5 rounded",
              "hover:bg-accent/50 active:bg-accent/70 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              isOpen && "bg-accent/50"
            )}
            type="button"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-muted-foreground flex items-center gap-1">
              {label}
              <Info className={cn(
                "h-3 w-3",
                isOpen ? "text-primary" : "text-muted-foreground/50",
                "transition-colors"
              )} />
            </span>
            <span className="font-medium tabular-nums">{value}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side={isMobile ? "bottom" : "top"} 
          align="start" 
          className="max-w-[250px] text-sm"
          sideOffset={5}
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}