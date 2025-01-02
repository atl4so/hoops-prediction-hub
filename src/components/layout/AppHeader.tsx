import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileMenu } from "./MobileMenu";
import { DesktopNav } from "./DesktopNav";
import { getNavigationItems } from "./NavigationItems";
import { ProfileMenu } from "../profile/ProfileMenu";

export function AppHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const loadNavItems = async () => {
      const items = await getNavigationItems(isAuthenticated);
      setMenuItems(items);
    };

    loadNavItems();
  }, [isAuthenticated]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    }
  };

  // Hide header on index page for non-authenticated users
  if (location.pathname === "/" && !isAuthenticated) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <MobileMenu 
              menuItems={menuItems}
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
          )}
          
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center space-x-2"
          >
            <span className="font-bold">euroleague.bet</span>
          </Link>

          {isAuthenticated && (
            <DesktopNav 
              menuItems={menuItems}
              currentPath={location.pathname}
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && <ProfileMenu />}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}