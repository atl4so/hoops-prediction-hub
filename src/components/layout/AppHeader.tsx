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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              {menuItems.map((item) => (
                <DropdownMenuItem key={item.title} asChild>
                  <Link 
                    to={item.path}
                    className="flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
              {isAuthenticated && (
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="h-6 w-6" />
            <span className="font-bold hidden md:inline-block">euroleague.bet</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Button
                key={item.title}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link to={item.path} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}