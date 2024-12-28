import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUserId(session.user.id);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['predictions', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          *,
          game:games (
            game_date,
            home_team:teams!games_home_team_id_fkey (name),
            away_team:teams!games_away_team_id_fkey (name)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Your Predictions</h1>
        <p className="text-muted-foreground">
          Track your predictions and their outcomes
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {predictions?.map((prediction) => (
          <Card key={prediction.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                {prediction.game.home_team.name} vs {prediction.game.away_team.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Game Date: {format(new Date(prediction.game.game_date), "PPP 'at' p")}
                </p>
                <p className="font-medium">
                  Your Prediction: {prediction.prediction_home_score} - {prediction.prediction_away_score}
                </p>
                {prediction.points_earned !== null && (
                  <p className="text-sm">
                    Points Earned: <span className="font-semibold">{prediction.points_earned}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {predictions?.length === 0 && (
          <div className="col-span-2 text-center py-8">
            <p className="text-muted-foreground">You haven't made any predictions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;