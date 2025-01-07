import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MobileMenu } from "./MobileMenu";
import { DesktopNav } from "./DesktopNav";
import { navigationItems } from "./NavigationItems";
import { ProfileMenu } from "../profile/ProfileMenu";
import { Settings } from "lucide-react";
import { ThemeToggle } from "../theme/ThemeToggle";

export function AppHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const loadNavItems = async () => {
      let items = [...navigationItems];
      if (isAuthenticated) {
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
      } else {
        items = items.filter(item => item.public);
      }
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background-dark/95 dark:border-border/10">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <div className="flex flex-1 items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <MobileMenu 
              menuItems={menuItems}
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
            
            <Link 
              to={isAuthenticated ? "/overview" : "/"} 
              className="flex items-center space-x-2"
            >
              <span className="font-bold text-lg dark:text-white">euroleague.bet</span>
            </Link>
          </div>

          <DesktopNav 
            menuItems={menuItems}
            currentPath={location.pathname}
            isAuthenticated={isAuthenticated}
          />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && <ProfileMenu />}
          </div>
        </div>
      </div>
    </header>
  );
}