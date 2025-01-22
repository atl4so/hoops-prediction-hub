import { Card, CardContent } from "@/components/ui/card";

export function StatisticsLegend() {
  const stats = [
    {
      category: "Per-Minute Metrics",
      items: [
        { label: "PIR/m", description: "Performance Index Rating per minute - Measures overall efficiency normalized by playing time" },
        { label: "PTS/m", description: "Points scored per minute - Scoring efficiency relative to playing time" },
        { label: "REB/m", description: "Rebounds per minute - Total rebounds (offensive + defensive) divided by minutes played" },
        { label: "DEF/m", description: "Defensive actions per minute - Combined steals and blocks per minute" },
      ]
    },
    {
      category: "Shooting & Efficiency",
      items: [
        { label: "FG%", description: "Field Goal Percentage - (Made shots / Attempted shots) × 100" },
        { label: "TS%", description: "True Shooting Percentage - Points per shooting possession, accounting for all shot types" },
        { label: "Floor Impact", description: "Combined contribution (points + rebounds + assists) per minute" },
      ]
    },
    {
      category: "Team Impact",
      items: [
        { label: "PTS%", description: "Percentage of team's total points scored by the player" },
        { label: "AST%", description: "Percentage of team's total assists by the player" },
        { label: "AST/TO", description: "Assist to Turnover ratio - Higher values indicate better ball security" },
      ]
    }
  ];

  return (
    <Card className="mt-8 bg-gradient-to-br from-background to-muted/5 border border-border/50">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Statistics Guide</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((category) => (
            <div key={category.category}>
              <h4 className="font-medium text-primary mb-2">{category.category}</h4>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <div key={item.label} className="text-sm">
                    <span className="font-medium text-secondary-foreground">{item.label}</span>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}