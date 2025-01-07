import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import { RegisterForm } from "../auth/RegisterForm";
import Overview from "@/pages/Overview";
import Admin from "@/pages/Admin";
import Leaderboard from "@/pages/Leaderboard";
import Predict from "@/pages/Predict";
import Following from "@/pages/Following";
import Rules from "@/pages/Rules";
import Terms from "@/pages/Terms";
import MyPredictions from "@/pages/MyPredictions";
import Teams from "@/pages/Teams";
import { useSession } from "@supabase/auth-helpers-react";

export const AppRoutes = () => {
  const session = useSession();
  const isAuthenticated = !!session;

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/terms" element={<Terms />} />
        
        {/* Protected routes */}
        <Route
          path="/overview"
          element={isAuthenticated ? <Overview /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={isAuthenticated ? <Admin /> : <Navigate to="/login" />}
        />
        <Route
          path="/leaderboard"
          element={isAuthenticated ? <Leaderboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/following"
          element={isAuthenticated ? <Following /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-predictions"
          element={isAuthenticated ? <MyPredictions /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}