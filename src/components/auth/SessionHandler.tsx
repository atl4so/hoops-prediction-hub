import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const SessionHandler = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    if (!isLoading) {
      if (!session && !isPublicRoute) {
        navigate('/login');
      } else if (session && isPublicRoute) {
        navigate('/predict');
      }
    }
  }, [session, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};