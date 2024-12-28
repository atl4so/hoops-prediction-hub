import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AdminStatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
}

export function AdminStatsCard({ title, value, icon: Icon }: AdminStatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value || '...'}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}