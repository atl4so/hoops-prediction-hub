import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { GameCard } from "@/components/games/GameCard";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, TrendingUp } from "lucide-react";

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

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['predictions', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          id,
          prediction_home_score,
          prediction_away_score,
          points_earned,
          game:games (
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey (
              id,
              name,
              logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
              id,
              name,
              logo_url
            ),
            round:rounds (
              id,
              name
            ),
            game_results (
              home_score,
              away_score
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching predictions:', error);
        throw error;
      }
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

  // Group predictions by round
  const predictionsByRound = predictions?.reduce((acc, prediction) => {
    const roundId = prediction.game.round.id;
    if (!acc[roundId]) {
      acc[roundId] = {
        name: prediction.game.round.name,
        predictions: []
      };
    }
    acc[roundId].predictions.push(prediction);
    return acc;
  }, {} as Record<string, { name: string; predictions: typeof predictions }>) || {};

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Your Predictions</h1>
        <p className="text-muted-foreground">
          Track your predictions and their outcomes
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{userProfile?.total_points || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Target className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Points per Game</p>
                <p className="text-2xl font-bold">
                  {userProfile?.points_per_game?.toFixed(1) || '0.0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Predictions</p>
                <p className="text-2xl font-bold">{userProfile?.total_predictions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-12">
        {Object.entries(predictionsByRound).map(([roundId, { name, predictions }]) => (
          <section key={roundId} className="space-y-6">
            <h2 className="text-2xl font-display font-semibold tracking-tight">
              Round {name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {predictions.map((prediction) => (
                <GameCard
                  key={prediction.game.id}
                  game={prediction.game}
                  isAuthenticated={true}
                  userId={userId}
                  prediction={{
                    prediction_home_score: prediction.prediction_home_score,
                    prediction_away_score: prediction.prediction_away_score,
                    points_earned: prediction.points_earned
                  }}
                />
              ))}
            </div>
          </section>
        ))}

        {!predictions?.length && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You haven't made any predictions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;