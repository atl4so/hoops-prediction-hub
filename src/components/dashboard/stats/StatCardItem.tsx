import { LucideIcon } from "lucide-react";
import { StatCard } from "./StatCard";

interface StatCardItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  onClick?: () => void;
  delay?: number;
}

export function StatCardItem({
  icon,
  label,
  value,
  description,
  onClick,
  delay = 0
}: StatCardItemProps) {
  return (
    <StatCard
      icon={icon}
      label={label}
      value={value}
      description={description}
      onClick={onClick}
      delay={delay}
    />
  );
}