import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoundManager } from "@/components/admin/RoundManager";
import { GameManager } from "@/components/admin/GameManager";
import { TeamsList } from "@/components/admin/TeamsList";
import { GameResults } from "@/components/admin/GameResults";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
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
        navigate('/dashboard');
      } else {
        setIsAdmin(true);
      }
    };

    checkAdmin();
  }, [navigate, toast]);

  if (!isAdmin) return null;

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage rounds, games, results, and teams
        </p>
      </section>

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