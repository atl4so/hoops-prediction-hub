import { useState, useEffect } from "react";
import { Menu, User, Trophy, Users, BarChart2, LogOut, Home } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

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
      setIsOpen(false);
    }
  };

  const authenticatedMenuItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { title: "Leaderboard", icon: Trophy, path: "/leaderboard" },
    { title: "Following", icon: Users, path: "/following" },
    { title: "Profile", icon: User, path: "/profile" },
    { title: "Statistics", icon: BarChart2, path: "/statistics" },
  ];

  const publicMenuItems = [
    { title: "Home", icon: Home, path: "/" },
    { title: "Login", icon: User, path: "/login" },
    { title: "Register", icon: Users, path: "/register" },
  ];

  const menuItems = isAuthenticated ? authenticatedMenuItems : publicMenuItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Hoops Hub</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-4">
              {menuItems.map((item) => (
                <Button
                  key={item.title}
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className="justify-start gap-2"
                  asChild
                >
                  <Link to={item.path} onClick={() => setIsOpen(false)}>
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  className="justify-start gap-2 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        
        <Link to="/" className="mr-4 flex items-center space-x-2">
          <Trophy className="h-6 w-6" />
          <span className="font-bold">Hoops Hub</span>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2">
          <nav className="flex items-center space-x-2">
            {/* Add any additional header items here */}
          </nav>
          <div className="flex items-center justify-end space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}