import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GameResultCard } from "./games/results/GameResultCard";
import { useGameResults } from "./games/results/useGameResults";
import { toast } from "sonner";

export function GameResults() {
  const session = useSession();
  const navigate = useNavigate();
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [scores, setScores] = useState({ home: "", away: "" });
  const [gameCode, setGameCode] = useState("");

  const { games, isLoading, updateResult } = useGameResults();

  // Check if user is admin
  if (!session?.user?.email || session.user.email !== 'likasvy@gmail.com') {
    navigate('/login');
    return null;
  }

  const updateFenerVirtus = async () => {
    const fenerGame = games?.find(
      game => 
        game.game_date.includes("2024-02") && // Games in February 2024
        ((game.home_team.name.includes("Fenerbahce") && game.away_team.name.includes("Virtus")) ||
        (game.away_team.name.includes("Fenerbahce") && game.home_team.name.includes("Virtus")))
    );

    if (!fenerGame) {
      toast.error("Fenerbahce vs Virtus game not found");
      return;
    }

    try {
      await updateResult.mutateAsync({
        gameId: fenerGame.id,
        homeScore: 95,
        awayScore: 81,
        gameCode: fenerGame.game_code
      });
      toast.success("Fenerbahce vs Virtus result updated successfully");
    } catch (error) {
      console.error('Error updating Fenerbahce vs Virtus game:', error);
      toast.error("Failed to update game result");
    }
  };

  const updateMonacoReal = async () => {
    const monacoGame = games?.find(
      game => 
        game.game_date.includes("2024-02") && // Games in February 2024
        ((game.home_team.name.includes("Monaco") && game.away_team.name.includes("Real Madrid")) ||
        (game.away_team.name.includes("Monaco") && game.home_team.name.includes("Real Madrid")))
    );

    if (!monacoGame) {
      toast.error("Monaco vs Real Madrid game not found");
      return;
    }

    try {
      await updateResult.mutateAsync({
        gameId: monacoGame.id,
        homeScore: 77,
        awayScore: 73,
        gameCode: monacoGame.game_code
      });
      toast.success("Monaco vs Real Madrid result updated successfully");
    } catch (error) {
      console.error('Error updating Monaco vs Real Madrid game:', error);
      toast.error("Failed to update game result");
    }
  };

  // Call the update functions when component mounts
  useEffect(() => {
    updateFenerVirtus();
    updateMonacoReal();
  }, []);

  const handleEdit = (game: any) => {
    setEditingGame(game.id);
    setScores({
      home: game.game_results?.[0]?.home_score?.toString() || "",
      away: game.game_results?.[0]?.away_score?.toString() || ""
    });
    setGameCode(game.game_code || "");
  };

  const handleSave = async (gameId: string) => {
    const homeScore = parseInt(scores.home);
    const awayScore = parseInt(scores.away);

    if (isNaN(homeScore) || isNaN(awayScore)) {
      toast.error("Please enter valid scores");
      return;
    }

    try {
      await updateResult.mutateAsync({ 
        gameId, 
        homeScore: homeScore,
        awayScore: awayScore,
        gameCode: gameCode
      });
      setEditingGame(null);
      setScores({ home: "", away: "" });
      setGameCode("");
      toast.success("Game result and code updated successfully");
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast.error("Failed to update game result");
    }
  };

  const handleCancel = () => {
    setEditingGame(null);
    setScores({ home: "", away: "" });
    setGameCode("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Game Results</h2>
      </div>

      <div className="grid gap-4">
        {games?.map((game) => (
          <GameResultCard
            key={game.id}
            game={game}
            editingGame={editingGame}
            scores={scores}
            gameCode={gameCode}
            onScoreChange={(type, value) => setScores(prev => ({ ...prev, [type]: value }))}
            onGameCodeChange={(value) => setGameCode(value)}
            onSave={handleSave}
            onEdit={handleEdit}
            onCancel={handleCancel}
          />
        ))}
      </div>
    </div>
  );
}
