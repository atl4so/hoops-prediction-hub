import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserProfile } from "@/components/dashboard/UserProfile";
import { useCurrentRoundRank } from "@/components/dashboard/useCurrentRoundRank";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/dashboard/sections/DashboardStats";
import { PageHeader } from "@/components/shared/PageHeader";

export default function Overview() {
  const session = useSession();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }
        setUserId(session.user.id);
      } catch (error) {
        console.error('Session check error:', error);
        toast.error("Session error. Please try logging in again.");
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  const { data: userProfileData, isError: profileError } = useUserProfile(userId);
  const currentRoundRank = useCurrentRoundRank(userId);

  if (profileError) {
    toast.error("Failed to load data");
    return null;
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 animate-fade-in">
      <PageHeader title="Overview">
        <p className="text-muted-foreground">Track your performance and statistics</p>
      </PageHeader>
      
      <DashboardStats
        totalPoints={userProfileData?.total_points || 0}
        pointsPerGame={userProfileData?.points_per_game || 0}
        totalPredictions={userProfileData?.total_predictions || 0}
        highestGamePoints={userProfileData?.highest_game_points}
        highestRoundPoints={userProfileData?.highest_round_points}
        allTimeRank={userProfileData?.allTimeRank}
        currentRoundRank={currentRoundRank}
        winnerPredictionsCorrect={userProfileData?.winner_predictions_correct}
        winnerPredictionsTotal={userProfileData?.winner_predictions_total}
        userId={userId}
      />
    </div>
  );
}