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
import { BasketballAnalyst } from "@/components/admin/analyst/BasketballAnalyst";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const Admin = () => {
  const session = useSession();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
      <div className="card p-6">
        <Tabs defaultValue="games" className="space-y-6">
          <div className="sticky top-0 z-50 bg-background pb-4">
            <TabsList 
              className={`${
                isMobile 
                  ? 'grid grid-cols-3 gap-2' 
                  : 'grid grid-cols-6'
              } w-full bg-accent`}
            >
              <TabsTrigger 
                value="games"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Games
              </TabsTrigger>
              <TabsTrigger 
                value="rounds"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Rounds
              </TabsTrigger>
              <TabsTrigger 
                value="teams"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Teams
              </TabsTrigger>
              <TabsTrigger 
                value="results"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Results
              </TabsTrigger>
              <TabsTrigger 
                value="background"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                BG
              </TabsTrigger>
              <TabsTrigger 
                value="analyst"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                AI
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="relative mt-16 md:mt-0">
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
            <TabsContent value="analyst" className="space-y-4">
              <BasketballAnalyst />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;