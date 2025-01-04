import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const SessionHandler = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !session && location.pathname !== '/') {
      navigate('/');
    }
  }, [session, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};