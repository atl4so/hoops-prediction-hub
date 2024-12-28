import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowedUsersList } from "./FollowedUsersList";
import { FollowedUsersPredictions } from "./FollowedUsersPredictions";

export function FollowingSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Following</h2>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Following Users</TabsTrigger>
          <TabsTrigger value="predictions">Their Predictions</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <FollowedUsersList />
        </TabsContent>
        <TabsContent value="predictions">
          <FollowedUsersPredictions />
        </TabsContent>
      </Tabs>
    </div>
  );
}