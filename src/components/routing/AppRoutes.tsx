import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Overview from "@/pages/Overview";
import Admin from "@/pages/Admin";
import Leaderboard from "@/pages/Leaderboard";
import Predict from "@/pages/Predict";
import Following from "@/pages/Following";
import Rules from "@/pages/Rules";
import Terms from "@/pages/Terms";
import MyPredictions from "@/pages/MyPredictions";
import { useSession } from "@supabase/auth-helpers-react";

export const AppRoutes = () => {
  const session = useSession();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={!session ? <Index /> : <Navigate to="/predict" />} />
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/predict" />} />
      <Route path="/register" element={!session ? <RegisterForm /> : <Navigate to="/predict" />} />
      <Route path="/terms" element={<Terms />} />

      {/* Protected routes */}
      <Route path="/overview" element={session ? <Overview /> : <Navigate to="/login" />} />
      <Route path="/admin" element={session ? <Admin /> : <Navigate to="/login" />} />
      <Route path="/leaderboard" element={session ? <Leaderboard /> : <Navigate to="/login" />} />
      <Route path="/predict" element={session ? <Predict /> : <Navigate to="/login" />} />
      <Route path="/following" element={session ? <Following /> : <Navigate to="/login" />} />
      <Route path="/my-predictions" element={session ? <MyPredictions /> : <Navigate to="/login" />} />
      <Route path="/rules" element={session ? <Rules /> : <Navigate to="/login" />} />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};