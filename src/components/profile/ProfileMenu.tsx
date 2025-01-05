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
import { useCurrentRoundRank } from "@/components/dashboard/useCurrentRoundRank";
import { Loader2, Trophy, ListOrdered } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ProfileMenu() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const { data: profile, isLoading } = useUserProfile(session?.user?.id || null);
  const currentRoundRank = useCurrentRoundRank(session?.user?.id || null);

  const handleLogout = async () => {
    try {
      // Clear any local storage/session storage first
      localStorage.clear();
      sessionStorage.clear();

      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // If there's a session_not_found error, we can ignore it since we're logging out anyway
      if (error && !error.message.includes('session_not_found')) {
        console.error('Logout error:', error);
        toast.error("Failed to log out. Please try again.");
      }

      // Always navigate to login page
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to log out. Please try again.");
      // Still navigate to login page even if there's an error
      navigate("/login");
    }
  };

  if (!session) {
    navigate("/login");
    return null;
  }

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;

  return (
    <>
      <DropdownMenu>
        <div className="flex items-center gap-4">
          {/* Desktop Rank Display - Non-clickable */}
          <div className="hidden md:flex items-center gap-4 pointer-events-none">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 bg-accent/50 px-3 py-1.5 rounded-full">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-muted-foreground font-medium">ATR:</span>
                    <span className="font-semibold text-foreground">{profile?.allTimeRank || '-'}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>All Time Rank - Your overall position based on total points earned</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {currentRoundRank && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 bg-accent/50 px-3 py-1.5 rounded-full">
                      <ListOrdered className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground font-medium">Round {currentRoundRank.roundName}:</span>
                      <span className="font-semibold text-foreground">{currentRoundRank.rank || '-'}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your current rank in the latest round with completed games</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Profile Button - Only this triggers the dropdown */}
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-auto py-1.5 px-2 rounded-full hover:bg-accent/50">
              <span className="hidden md:block text-sm font-medium">Hi, {profile?.display_name}</span>
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
        </div>

        <DropdownMenuContent className="w-56 bg-white shadow-lg" align="end" forceMount>
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
          {/* Mobile Rank Display */}
          <div className="md:hidden px-2 py-1.5 space-y-2">
            <div className="flex items-center gap-2 text-sm bg-accent/50 px-2 py-1.5 rounded-lg">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-muted-foreground font-medium">ATR:</span>
              <span className="font-semibold">{profile?.allTimeRank || '-'}</span>
            </div>
            {currentRoundRank && (
              <div className="flex items-center gap-2 text-sm bg-accent/50 px-2 py-1.5 rounded-lg">
                <ListOrdered className="h-4 w-4 text-blue-500" />
                <span className="text-muted-foreground font-medium">Round {currentRoundRank.roundName}:</span>
                <span className="font-semibold">{currentRoundRank.rank || '-'}</span>
              </div>
            )}
          </div>
          <DropdownMenuSeparator className="md:hidden" />
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
