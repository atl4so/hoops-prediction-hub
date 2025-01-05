import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamPredictionPatternsProps {
  stats: any;
}

export function TeamPredictionPatterns({ stats }: TeamPredictionPatternsProps) {
  const StatCard = ({ icon: Icon, label, value, subValue, className = "" }) => (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-lg border-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
      "transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5",
      className
    )}>
      <div className="rounded-xl p-3 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={Trophy}
          label="Underdog Wins"
          value={stats?.underdog_wins || 0}
          subValue={`Avg. Margin: ${stats?.avg_upset_margin || 'N/A'} pts`}
          className="bg-green-50/50"
        />
        <StatCard
          icon={Target}
          label="Unexpected Losses"
          value={stats?.unexpected_losses || 0}
          subValue={`Avg. Margin: ${stats?.avg_loss_margin || 'N/A'} pts`}
          className="bg-red-50/50"
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Margin Distribution</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-green-600" />
                Wins
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">1-9 points</span>
                  <span className="font-semibold">{stats?.margin_1_9_wins || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">10-15 points</span>
                  <span className="font-semibold">{stats?.margin_10_15_wins || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">15+ points</span>
                  <span className="font-semibold">{stats?.margin_15plus_wins || 0}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-red-600" />
                Losses
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">1-9 points</span>
                  <span className="font-semibold">{stats?.margin_1_9_losses || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">10-15 points</span>
                  <span className="font-semibold">{stats?.margin_10_15_losses || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">15+ points</span>
                  <span className="font-semibold">{stats?.margin_15plus_losses || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}