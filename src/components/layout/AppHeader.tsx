import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { ProfileMenu } from "../profile/ProfileMenu";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "../theme/ThemeToggle";

export function AppHeader() {
  const session = useSession();

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
              <MobileMenu />
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