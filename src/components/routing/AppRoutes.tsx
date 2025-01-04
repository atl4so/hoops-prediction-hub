import { Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Overview from "@/pages/Overview";
import Admin from "@/pages/Admin";
import Leaderboard from "@/pages/Leaderboard";
import Predict from "@/pages/Predict";
import Following from "@/pages/Following";
import MyPredictions from "@/pages/MyPredictions";
import Rules from "@/pages/Rules";
import Terms from "@/pages/Terms";

export const AppRoutes = () => {
  const session = useSession();

  return (
    <Routes>
      {/* Public routes - always accessible */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/terms" element={<Terms />} />

      {/* Protected routes - require authentication */}
      <Route 
        path="/overview" 
        element={session ? <Overview /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/admin" 
        element={session ? <Admin /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/leaderboard" 
        element={session ? <Leaderboard /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/predict" 
        element={session ? <Predict /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/following" 
        element={session ? <Following /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/my-predictions" 
        element={session ? <MyPredictions /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/rules" 
        element={session ? <Rules /> : <Navigate to="/login" replace />} 
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};