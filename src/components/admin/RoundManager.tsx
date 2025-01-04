import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { format, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function RoundManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRound, setEditingRound] = useState<any>(null);

  const { data: rounds, isLoading } = useQuery({
    queryKey: ['rounds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rounds')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createRound = useMutation({
    mutationFn: async () => {
      if (!startDate || !endDate || !name) {
        throw new Error("Please fill in all fields");
      }

      const { error } = await supabase
        .from('rounds')
        .insert([
          {
            name,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
          },
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      toast({ title: "Success", description: "Round created successfully" });
      setName("");
      setStartDate(undefined);
      setEndDate(undefined);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateRound = useMutation({
    mutationFn: async () => {
      if (!startDate || !endDate || !name || !editingRound) {
        throw new Error("Please fill in all fields");
      }

      console.log('Attempting to update round:', editingRound.id);
      
      const { data, error } = await supabase
        .from('rounds')
        .update({
          name,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        })
        .eq('id', editingRound.id)
        .select();

      if (error) {
        console.error('Error updating round:', error);
        throw error;
      }
      
      console.log('Successfully updated round:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      toast({ title: "Success", description: "Round updated successfully" });
      setIsEditOpen(false);
      setEditingRound(null);
      setName("");
      setStartDate(undefined);
      setEndDate(undefined);
    },
    onError: (error) => {
      console.error('Update round error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteRound = useMutation({
    mutationFn: async (roundId: string) => {
      console.log('Attempting to delete round:', roundId);
      
      const { data, error } = await supabase
        .from('rounds')
        .delete()
        .eq('id', roundId)
        .select();
      
      if (error) {
        console.error('Error deleting round:', error);
        throw error;
      }
      
      console.log('Successfully deleted round:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      toast({ title: "Success", description: "Round and associated games deleted successfully" });
    },
    onError: (error) => {
      console.error('Delete round error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (round: any) => {
    setEditingRound(round);
    setName(round.name);
    setStartDate(new Date(round.start_date));
    setEndDate(new Date(round.end_date));
    setIsEditOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "PPP") : "Invalid date";
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Input
            placeholder="Round Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button onClick={() => createRound.mutate()}>Create Round</Button>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Round</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Round Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={() => updateRound.mutate()}>Update Round</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Existing Rounds</h3>
        <div className="grid gap-4">
          {rounds?.map((round) => (
            <div
              key={round.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 className="font-medium">{round.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(round.start_date)} - {formatDate(round.end_date)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(round)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteRound.mutate(round.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}