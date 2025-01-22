import { Routes, Route } from "react-router-dom";
import Overview from "@/pages/Overview";
import Predict from "@/pages/Predict";
import MyPredictions from "@/pages/MyPredictions";
import Following from "@/pages/Following";
import Teams from "@/pages/Teams";
import Leaderboard from "@/pages/Leaderboard";
import Rules from "@/pages/Rules";
import GameStats from "@/pages/GameStats";
import Game from "@/pages/Game";
import Login from "@/pages/Login";
import Terms from "@/pages/Terms";
import Player from "@/pages/Player";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/predict" element={<Predict />} />
      <Route path="/my-predictions" element={<MyPredictions />} />
      <Route path="/following" element={<Following />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/game-stats" element={<GameStats />} />
      <Route path="/game/:gameCode" element={<Game />} />
      <Route path="/login" element={<Login />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/player/:playerCode" element={<Player />} />
    </Routes>
  );
}
