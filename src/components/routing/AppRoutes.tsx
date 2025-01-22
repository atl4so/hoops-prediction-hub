import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import Game from "@/pages/Game";
import Player from "@/pages/Player";
import GameStats from "@/pages/GameStats";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/game/:gameCode" element={<Game />} />
      <Route path="/player/:playerCode" element={<Player />} />
      <Route path="/game-stats" element={<GameStats />} />
    </Routes>
  );
}