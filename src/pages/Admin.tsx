import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GameCreateForm } from "@/components/admin/GameCreateForm";
import { GameResults } from "@/components/admin/GameResults";
import { GamesList } from "@/components/admin/GamesList";
import { TeamsList } from "@/components/admin/TeamsList";
import { RoundManager } from "@/components/admin/RoundManager";

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab("games")} className={`tab ${activeTab === "games" ? "active" : ""}`}>Games</button>
        <button onClick={() => setActiveTab("results")} className={`tab ${activeTab === "results" ? "active" : ""}`}>Results</button>
        <button onClick={() => setActiveTab("teams")} className={`tab ${activeTab === "teams" ? "active" : ""}`}>Teams</button>
        <button onClick={() => setActiveTab("rounds")} className={`tab ${activeTab === "rounds" ? "active" : ""}`}>Rounds</button>
      </div>

      {activeTab === "games" && <GamesList />}
      {activeTab === "results" && <GameResults />}
      {activeTab === "teams" && <TeamsList />}
      {activeTab === "rounds" && <RoundManager />}
      <GameCreateForm />
    </div>
  );
}
