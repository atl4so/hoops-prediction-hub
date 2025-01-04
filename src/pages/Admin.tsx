import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoundManager } from "@/components/admin/RoundManager";
import { GameManager } from "@/components/admin/GameManager";
import { TeamsList } from "@/components/admin/TeamsList";
import { GameResults } from "@/components/admin/GameResults";
import { useToast } from "@/hooks/use-toast";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStats } from "@/components/admin/stats/AdminStats";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        if (session.user.email !== 'likasvy@gmail.com') {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-8">
      <AdminHeader />
      <AdminStats />

      <Tabs defaultValue="rounds" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rounds">Rounds</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
        <TabsContent value="rounds">
          <Card>
            <CardHeader>
              <CardTitle>Manage Rounds</CardTitle>
            </CardHeader>
            <CardContent>
              <RoundManager />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="games">
          <Card>
            <CardHeader>
              <CardTitle>Manage Games</CardTitle>
            </CardHeader>
            <CardContent>
              <GameManager />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Game Results</CardTitle>
            </CardHeader>
            <CardContent>
              <GameResults />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Teams List</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
