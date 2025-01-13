import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortField, SortDirection, SortHeader } from "./SortableHeader";

interface LeaderboardHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function LeaderboardHeader({ sortField, sortDirection, onSort }: LeaderboardHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-b-2">
        <TableHead className="w-[80px] font-bold text-base">Rank</TableHead>
        <TableHead className="w-[200px] font-bold text-base">Player</TableHead>
        <TableHead className="w-[120px] text-right font-bold text-base">
          <SortHeader field="points" currentSort={sortField} direction={sortDirection} onSort={onSort}>
            Points
          </SortHeader>
        </TableHead>
        <TableHead className="w-[120px] text-right font-bold text-base">
          <SortHeader field="ppg" currentSort={sortField} direction={sortDirection} onSort={onSort}>
            PPG
          </SortHeader>
        </TableHead>
        <TableHead className="w-[120px] text-right font-bold text-base">
          <SortHeader field="efficiency" currentSort={sortField} direction={sortDirection} onSort={onSort}>
            Efficiency
          </SortHeader>
        </TableHead>
        <TableHead className="w-[120px] text-right font-bold text-base">
          <SortHeader field="underdog" currentSort={sortField} direction={sortDirection} onSort={onSort}>
            Underdog Picks
          </SortHeader>
        </TableHead>
        <TableHead className="w-[120px] text-right font-bold text-base">
          <SortHeader field="winner" currentSort={sortField} direction={sortDirection} onSort={onSort}>
            Winner %
          </SortHeader>
        </TableHead>
        <TableHead className="w-[100px] text-right font-bold text-base">
          <SortHeader field="games" currentSort={sortField} direction={sortDirection} onSort={onSort}>
            Games
          </SortHeader>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}