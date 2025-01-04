import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GameCreateForm } from "@/components/admin/GameCreateForm";
import { GameResults } from "@/components/admin/GameResults";
import { GamesList } from "@/components/admin/GamesList";
import { TeamsList } from "@/components/admin/TeamsList";
import { RoundManager } from "@/components/admin/RoundManager";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("games");

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user || session.user.email !== 'likasvy@gmail.com') {
        console.error('Unauthorized access attempt');
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b mb-4 bg-transparent p-0 h-auto">
          <TabsTrigger 
            value="games"
            className="px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Games
          </TabsTrigger>
          <TabsTrigger 
            value="results"
            className="px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Results
          </TabsTrigger>
          <TabsTrigger 
            value="teams"
            className="px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Teams
          </TabsTrigger>
          <TabsTrigger 
            value="rounds"
            className="px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Rounds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="mt-6">
          <GamesList />
          <div className="mt-8">
            <GameCreateForm />
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <GameResults />
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <TeamsList />
        </TabsContent>

        <TabsContent value="rounds" className="mt-6">
          <RoundManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}