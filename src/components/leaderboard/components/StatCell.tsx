import { TableCell } from "@/components/ui/table";

interface StatCellProps {
  value: number | string;
  suffix?: string;
  width?: string;
}

export function StatCell({ value, suffix = "", width = "w-32" }: StatCellProps) {
  return (
    <TableCell className={`${width} text-right`}>
      <span className="font-semibold text-base">
        {value}
        {suffix}
      </span>
    </TableCell>
  );
}