import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MobileMenu } from "./MobileMenu";
import { DesktopNav } from "./DesktopNav";
import { navigationItems, publicItems } from "./NavigationItems";
import { ProfileMenu } from "../profile/ProfileMenu";
import { Settings } from "lucide-react";

export function AppHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuItems, setMenuItems] = useState(publicItems);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const loadNavItems = async () => {
      if (isAuthenticated) {
        let items = [...navigationItems];
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email === 'likasvy@gmail.com') {
          items = [
            ...items,
            {
              title: "Admin",
              href: "/admin",
              icon: Settings,
              public: false
            },
          ];
        }
        setMenuItems(items);
      } else {
        setMenuItems(publicItems);
      }
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center gap-6">
          {isAuthenticated && (
            <MobileMenu 
              menuItems={menuItems}
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
          )}
          
          <Link 
            to={isAuthenticated ? "/overview" : "/"} 
            className="flex items-center space-x-2"
          >
            <span className="font-bold text-lg">euroleague.bet</span>
          </Link>

          <DesktopNav 
            menuItems={menuItems}
            authenticatedItems={[]}
            currentPath={location.pathname}
            isAuthenticated={isAuthenticated}
          />
        </div>

        <div className="flex items-center justify-end">
          {isAuthenticated && <ProfileMenu />}
        </div>
      </div>
    </header>
  );
}