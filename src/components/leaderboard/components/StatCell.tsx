import { TableCell } from "@/components/ui/table";

interface StatCellProps {
  value: number | string;
  suffix?: string;
}

export function StatCell({ value, suffix = "" }: StatCellProps) {
  return (
    <TableCell className="w-28 text-right pr-8">
      <span className="font-semibold text-base">
        {value}
        {suffix}
      </span>
    </TableCell>
  );
}