import { useNavigate } from "react-router-dom";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { MobileMenu } from "./MobileMenu";
import { DesktopNav } from "./DesktopNav";
import { navigationItems } from "./NavigationItems";
import { ProfileMenu } from "../profile/ProfileMenu";
import { useUserProfile } from "../dashboard/UserProfile";

export function AppHeader() {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const user = useUser();
  const { data: profile } = useUserProfile(user?.id || null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Check if user is admin by email
  const isAdmin = user?.email === 'likasvy@gmail.com';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-4">
          <MobileMenu 
            menuItems={navigationItems} 
            isAuthenticated={!!user}
            isAdmin={isAdmin}
            onLogout={handleLogout}
          />
          <a href="/" className="flex items-center space-x-2">
            <img src="/basketball-favicon.png" alt="Logo" className="logo" />
          </a>
        </div>
        <DesktopNav 
          menuItems={navigationItems} 
          isAuthenticated={!!user}
          isAdmin={isAdmin}
        />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ProfileMenu />
          </nav>
        </div>
      </div>
    </header>
  );
}