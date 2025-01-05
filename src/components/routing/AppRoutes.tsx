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

export const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/following" element={<Following />} />
        <Route path="/my-predictions" element={<MyPredictions />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
};