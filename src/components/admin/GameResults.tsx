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

  const updatePartizanParis = async () => {
    const partizanGame = games?.find(
      game => 
        (game.home_team.name.includes("Partizan") && game.away_team.name.includes("Paris")) ||
        (game.away_team.name.includes("Partizan") && game.home_team.name.includes("Paris"))
    );

    if (!partizanGame) {
      toast.error("Partizan vs Paris game not found");
      return;
    }

    try {
      await updateResult.mutateAsync({
        gameId: partizanGame.id,
        homeScore: 92,
        awayScore: 86,
        gameCode: partizanGame.game_code
      });
      toast.success("Game result updated successfully");
    } catch (error) {
      console.error('Error updating Partizan vs Paris game:', error);
      toast.error("Failed to update game result");
    }
  };

  const updateLyonPartizan = async () => {
    const lyonPartizanGame = games?.find(
      game => 
        (game.home_team.name.toLowerCase().includes("lyon") && game.away_team.name.toLowerCase().includes("partizan")) ||
        (game.away_team.name.toLowerCase().includes("lyon") && game.home_team.name.toLowerCase().includes("partizan"))
    );

    if (!lyonPartizanGame) {
      toast.error("Lyon vs Partizan game not found");
      return;
    }

    try {
      await updateResult.mutateAsync({
        gameId: lyonPartizanGame.id,
        homeScore: 62,
        awayScore: 93,
        gameCode: lyonPartizanGame.game_code
      });
      toast.success("Game result updated successfully");
    } catch (error) {
      console.error('Error updating Lyon vs Partizan game:', error);
      toast.error("Failed to update game result");
    }
  };

  // Call both update functions when component mounts
  useState(() => {
    updatePartizanParis();
    updateLyonPartizan();
  });

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