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
      // Only redirect to login if user is not authenticated and trying to access a protected route
      if (!session && !isPublicRoute) {
        navigate('/login');
      } 
      // Only redirect to predict if user is authenticated and trying to access auth routes
      else if (session && isPublicRoute) {
        navigate('/predict');
      }
    }
  }, [session, isLoading, navigate, location.pathname]);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // If we're on a public route or we have a session, show the children
  if (location.pathname === '/register' || location.pathname === '/login' || session) {
    return <>{children}</>;
  }

  // Otherwise show nothing (while redirecting)
  return null;
};
