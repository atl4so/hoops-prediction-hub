import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Home, Plane, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamOverviewProps {
  stats: any;
  distribution: any[];
}

export function TeamOverview({ stats, distribution }: TeamOverviewProps) {
  const StatCard = ({ icon: Icon, label, value, className = "" }) => (
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
      </div>
    </div>
  );

  return (
    <div className="space-y-6 py-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Trophy}
          label="Overall Success"
          value={`${stats?.overall_success_rate || 0}%`}
        />
        <StatCard
          icon={Home}
          label="Home Success"
          value={`${stats?.home_success_rate || 0}%`}
        />
        <StatCard
          icon={Plane}
          label="Away Success"
          value={`${stats?.away_success_rate || 0}%`}
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Result Distribution</h3>
          <div className="space-y-6">
            {distribution?.map((item) => (
              <div key={item.margin_range} className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{item.margin_range}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50 border border-green-100">
                    <div className="rounded-lg p-2 bg-green-100">
                      <Trophy className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Wins</p>
                      <p className="text-lg font-semibold text-green-600">{item.win_percentage}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50/50 border border-red-100">
                    <div className="rounded-lg p-2 bg-red-100">
                      <Percent className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Losses</p>
                      <p className="text-lg font-semibold text-red-600">{item.loss_percentage}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}