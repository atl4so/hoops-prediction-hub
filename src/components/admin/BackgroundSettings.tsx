import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { BackgroundSetting } from "@/types/supabase";

export function BackgroundSettings() {
  const [newUrl, setNewUrl] = useState("");
  const [opacity, setOpacity] = useState(60);
  const queryClient = useQueryClient();

  const { data: backgrounds, isLoading } = useQuery({
    queryKey: ["background-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("background_settings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BackgroundSetting[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (url: string) => {
      // First, set all existing backgrounds to inactive
      await supabase
        .from("background_settings")
        .update({ is_active: false })
        .neq("id", "00000000-0000-0000-0000-000000000000");

      // Then add the new background as active
      const { error } = await supabase.from("background_settings").insert({
        url,
        opacity,
        is_active: true,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["background-settings"] });
      setNewUrl("");
      toast.success("Background added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add background: " + error.message);
    },
  });

  const activateMutation = useMutation({
    mutationFn: async (background: BackgroundSetting) => {
      // First, set all backgrounds to inactive
      await supabase
        .from("background_settings")
        .update({ is_active: false })
        .neq("id", background.id);

      // Then set the selected background to active
      const { error } = await supabase
        .from("background_settings")
        .update({ is_active: true })
        .eq("id", background.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["background-settings"] });
      toast.success("Background activated successfully");
    },
    onError: (error) => {
      toast.error("Failed to activate background: " + error.message);
    },
  });

  const updateOpacityMutation = useMutation({
    mutationFn: async ({ id, opacity }: { id: string; opacity: number }) => {
      const { error } = await supabase
        .from("background_settings")
        .update({ opacity })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["background-settings"] });
      toast.success("Opacity updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update opacity: " + error.message);
    },
  });

  const handleAddBackground = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    addMutation.mutate(newUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Background Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAddBackground} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="background-url">Add New Background URL</Label>
            <Input
              id="background-url"
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Enter image URL"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Default Opacity ({opacity}%)</Label>
            <Slider
              value={[opacity]}
              onValueChange={(values) => setOpacity(values[0])}
              min={0}
              max={100}
              step={1}
            />
          </div>
          <Button type="submit" disabled={!newUrl || addMutation.isPending}>
            Add Background
          </Button>
        </form>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Saved Backgrounds</h3>
          {isLoading ? (
            <p>Loading backgrounds...</p>
          ) : (
            <div className="grid gap-4">
              {backgrounds?.map((background) => (
                <div
                  key={background.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="relative w-full h-32 bg-accent rounded-lg overflow-hidden">
                    <img
                      src={background.url}
                      alt="Background Preview"
                      className="w-full h-full object-cover"
                      style={{ opacity: background.opacity / 100 }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Opacity ({background.opacity}%)</Label>
                    <Slider
                      value={[background.opacity]}
                      onValueChange={(values) =>
                        updateOpacityMutation.mutate({
                          id: background.id,
                          opacity: values[0],
                        })
                      }
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                  <Button
                    variant={background.is_active ? "secondary" : "outline"}
                    onClick={() => activateMutation.mutate(background)}
                    disabled={background.is_active}
                    className="w-full"
                  >
                    {background.is_active ? "Active" : "Set as Active"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}