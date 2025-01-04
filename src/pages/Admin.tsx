import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GameManager } from "@/components/admin/GameManager";
import { RoundManager } from "@/components/admin/RoundManager";
import { TeamsList } from "@/components/admin/TeamsList";
import { GameResults } from "@/components/admin/GameResults";
import { AdminStats } from "@/components/admin/stats/AdminStats";
import { BackgroundSettings } from "@/components/admin/BackgroundSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session?.user.email || session.user.email !== "likasvy@gmail.com") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader />
      <AdminStats />
      <Tabs defaultValue="games" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="rounds">Rounds</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
        </TabsList>
        <TabsContent value="games" className="space-y-4">
          <GameManager />
        </TabsContent>
        <TabsContent value="rounds" className="space-y-4">
          <RoundManager />
        </TabsContent>
        <TabsContent value="teams" className="space-y-4">
          <TeamsList />
        </TabsContent>
        <TabsContent value="results" className="space-y-4">
          <GameResults />
        </TabsContent>
        <TabsContent value="background" className="space-y-4">
          <BackgroundSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;