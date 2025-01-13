import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortField, SortDirection, SortHeader } from "./SortableHeader";

interface LeaderboardHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function LeaderboardHeader({ 
  sortField, 
  sortDirection, 
  onSort 
}: LeaderboardHeaderProps) {
  return (
    <TableRow className="hover:bg-transparent border-b-2">
      <TableHead className="w-24 font-bold text-base">
        Rank
      </TableHead>
      <TableHead className="w-56 font-bold text-base">
        Player
      </TableHead>
      <TableHead className="w-32 text-right font-bold text-base">
        <SortHeader 
          field="points" 
          currentSort={sortField} 
          direction={sortDirection} 
          onSort={onSort}
        >
          Points
        </SortHeader>
      </TableHead>
      <TableHead className="w-32 text-right font-bold text-base">
        <SortHeader 
          field="ppg" 
          currentSort={sortField} 
          direction={sortDirection} 
          onSort={onSort}
        >
          PPG
        </SortHeader>
      </TableHead>
      <TableHead className="w-32 text-right font-bold text-base">
        <SortHeader 
          field="efficiency" 
          currentSort={sortField} 
          direction={sortDirection} 
          onSort={onSort}
        >
          Eff.
        </SortHeader>
      </TableHead>
      <TableHead className="w-32 text-right font-bold text-base">
        <SortHeader 
          field="underdog" 
          currentSort={sortField} 
          direction={sortDirection} 
          onSort={onSort}
        >
          Upsets
        </SortHeader>
      </TableHead>
      <TableHead className="w-32 text-right font-bold text-base">
        <SortHeader 
          field="winner" 
          currentSort={sortField} 
          direction={sortDirection} 
          onSort={onSort}
        >
          Correct
        </SortHeader>
      </TableHead>
      <TableHead className="w-32 text-right font-bold text-base">
        <SortHeader 
          field="games" 
          currentSort={sortField} 
          direction={sortDirection} 
          onSort={onSort}
        >
          Games
        </SortHeader>
      </TableHead>
    </TableRow>
  );
}