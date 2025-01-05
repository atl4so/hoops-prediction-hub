import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamsList } from "@/components/teams/list/TeamsList";
import { TeamDetailsDialog } from "@/components/teams/TeamDetailsDialog";
import type { Team } from "@/types/supabase";

type SortOption = "predictions" | "success" | "upsets" | "wins" | "losses";

export default function Teams() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("predictions");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Team[];
    },
  });

  const filteredTeams = teams?.filter(team => 
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Teams" />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center relative z-50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-[100]">
            <SelectItem value="predictions" className="hover:bg-accent">Most Predicted</SelectItem>
            <SelectItem value="success" className="hover:bg-accent">Best Win Rate</SelectItem>
            <SelectItem value="upsets" className="hover:bg-accent">Most Underdog Wins</SelectItem>
            <SelectItem value="wins" className="hover:bg-accent">Most Wins Predicted</SelectItem>
            <SelectItem value="losses" className="hover:bg-accent">Most Losses Predicted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative z-0">
        <TeamsList 
          teams={filteredTeams || []}
          isLoading={isLoading}
          onTeamClick={setSelectedTeam}
          sortBy={sort}
        />
      </div>

      <TeamDetailsDialog
        team={selectedTeam}
        open={!!selectedTeam}
        onOpenChange={(open) => !open && setSelectedTeam(null)}
      />
    </div>
  );
}