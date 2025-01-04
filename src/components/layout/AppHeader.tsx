import { Link } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { ProfileMenu } from "../profile/ProfileMenu";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "../theme/ThemeToggle";
import { navigationItems } from "./NavigationItems";
import { toast } from "sonner";

export function AppHeader() {
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Error logging out");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-display text-xl font-bold tracking-tight">
              euroleague.bet
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session ? (
            <>
              <ProfileMenu />
              <MobileMenu 
                menuItems={navigationItems}
                isAuthenticated={!!session}
                onLogout={handleLogout}
              />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}