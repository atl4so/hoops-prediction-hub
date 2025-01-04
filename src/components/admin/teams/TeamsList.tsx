import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash, Plus } from "lucide-react";
import { TeamDialog } from "./TeamDialog";

export function TeamsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const addTeam = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('teams')
        .insert([{ name: newTeamName, logo_url: newLogoUrl }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsAddOpen(false);
      setNewTeamName("");
      setNewLogoUrl("");
      toast({ title: "Success", description: "Team added successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTeam = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('teams')
        .update({ name: newTeamName, logo_url: newLogoUrl })
        .eq('id', editingTeam.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsEditOpen(false);
      setEditingTeam(null);
      setNewTeamName("");
      setNewLogoUrl("");
      toast({ title: "Success", description: "Team updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTeam = useMutation({
    mutationFn: async (teamId: string) => {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({ title: "Success", description: "Team deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (team: any) => {
    setEditingTeam(team);
    setNewTeamName(team.name);
    setNewLogoUrl(team.logo_url);
    setIsEditOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Team
        </Button>
      </div>

      <TeamDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={() => addTeam.mutate()}
        title="Add New Team"
        teamName={newTeamName}
        logoUrl={newLogoUrl}
        onTeamNameChange={setNewTeamName}
        onLogoUrlChange={setNewLogoUrl}
      />

      <TeamDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={() => updateTeam.mutate()}
        title="Edit Team"
        teamName={newTeamName}
        logoUrl={newLogoUrl}
        onTeamNameChange={setNewTeamName}
        onLogoUrlChange={setNewLogoUrl}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams?.map((team) => (
            <TableRow key={team.id}>
              <TableCell>
                <img
                  src={team.logo_url}
                  alt={`${team.name} logo`}
                  className="w-8 h-8 object-contain"
                />
              </TableCell>
              <TableCell>{team.name}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(team)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTeam.mutate(team.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}