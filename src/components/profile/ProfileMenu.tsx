import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProfileSettings } from "./ProfileSettings";
import { useUserProfile } from "@/components/dashboard/UserProfile";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ProfileMenu() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const { data: profile, isLoading } = useUserProfile(session?.user?.id || null);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (error.message.includes('session_not_found')) {
          // If session is not found, clear local storage and redirect
          localStorage.clear();
          sessionStorage.clear();
          navigate("/login");
          return;
        }
        throw error;
      }
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to log out. Please try again.");
      // Force redirect to login on critical errors
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    }
  };

  if (!session) {
    // If no session, redirect to login
    navigate("/login");
    return null;
  }

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={profile?.avatar_url || undefined} 
                alt={profile?.display_name || "User"} 
              />
              <AvatarFallback>
                {profile?.display_name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profile?.display_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowSettings(true)}>
            Profile settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileSettings
        open={showSettings}
        onOpenChange={setShowSettings}
        profile={profile}
      />
    </>
  );
}