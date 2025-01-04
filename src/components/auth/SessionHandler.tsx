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
      // If user is authenticated and tries to access auth routes, redirect to predict
      if (session && isPublicRoute) {
        navigate('/predict');
      }
      // If user is not authenticated and tries to access protected routes, redirect to login
      else if (!session && !isPublicRoute) {
        navigate('/login');
      }
    }
  }, [session, isLoading, navigate, location.pathname]);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // Show children once authentication check is complete
  return <>{children}</>;
};