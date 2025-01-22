import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
        homeScore: 92, // Setting Partizan's score
        awayScore: 86, // Setting Paris's score
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