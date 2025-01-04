import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoundDialog } from "./rounds/RoundDialog";
import { RoundList } from "./rounds/RoundList";

export function RoundManager() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRound, setEditingRound] = useState<any>(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [deletingId, setDeletingId] = useState<string>();

  const { data: rounds, isLoading } = useQuery({
    queryKey: ['rounds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rounds')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const createRound = useMutation({
    mutationFn: async () => {
      if (!startDate || !endDate || !name) {
        console.error("Please fill in all fields");
        return;
      }

      const { error } = await supabase
        .from('rounds')
        .insert({
          name,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      setIsCreateOpen(false);
      setName("");
      setStartDate(undefined);
      setEndDate(undefined);
    },
    onError: (error) => {
      console.error("Error creating round:", error);
    }
  });

  const updateRound = useMutation({
    mutationFn: async () => {
      if (!startDate || !endDate || !name || !editingRound) {
        console.error("Please fill in all fields");
        return;
      }

      const { error } = await supabase
        .from('rounds')
        .update({
          name,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingRound.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      setIsEditOpen(false);
      setEditingRound(null);
      setName("");
      setStartDate(undefined);
      setEndDate(undefined);
    },
    onError: (error) => {
      console.error("Error updating round:", error);
    }
  });

  const deleteRound = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      const { error } = await supabase
        .from('rounds')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      setDeletingId(undefined);
    },
    onError: (error) => {
      console.error("Error deleting round:", error);
      setDeletingId(undefined);
    }
  });

  const handleEdit = (round: any) => {
    setEditingRound(round);
    setName(round.name);
    setStartDate(new Date(round.start_date));
    setEndDate(new Date(round.end_date));
    setIsEditOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Rounds</h2>
        <Button onClick={() => setIsCreateOpen(true)}>
          Create Round
        </Button>
      </div>

      <RoundList
        rounds={rounds || []}
        onEdit={handleEdit}
        onDelete={(id) => deleteRound.mutate(id)}
        isDeletingId={deletingId}
      />

      <RoundDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create Round"
        name={name}
        startDate={startDate}
        endDate={endDate}
        onNameChange={setName}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSubmit={() => createRound.mutate()}
        isSubmitting={createRound.isPending}
        submitLabel="Create"
      />

      <RoundDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit Round"
        name={name}
        startDate={startDate}
        endDate={endDate}
        onNameChange={setName}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSubmit={() => updateRound.mutate()}
        isSubmitting={updateRound.isPending}
        submitLabel="Update"
      />
    </div>
  );
}