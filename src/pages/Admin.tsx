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
      <div className="grid gap-8">
        <AdminStats />
        <BackgroundSettings />
        <GameManager />
        <RoundManager />
        <TeamsList />
        <GameResults />
      </div>
    </div>
  );
};

export default Admin;