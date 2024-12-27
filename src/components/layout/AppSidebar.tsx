import { useEffect, useState } from "react";
import { Home, Trophy, Users, User, BarChart2, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AppSidebarProps {
  visible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

export function AppSidebar({ visible, onVisibilityChange }: AppSidebarProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  if (!visible) return null;

  return (
    <Sidebar className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-[52px] items-center justify-between px-4 py-2">
        <h2 className="text-lg font-semibold">Hoops Hub</h2>
        <SidebarTrigger onClick={() => onVisibilityChange(false)} />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    className="hover:bg-accent/50"
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {isAuthenticated && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-red-500 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}