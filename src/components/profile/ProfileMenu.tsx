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
import { Loader2, Trophy, ListOrdered, Settings, LogOut } from "lucide-react";
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (error.message.includes('session_not_found')) {
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
      localStorage.clear();
      sessionStorage.clear();
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
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-fit rounded-full px-2 md:pr-4 hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-offset-background transition-all hover:ring-primary">
                  <AvatarImage
                    src={profile?.avatar_url}
                    alt={profile?.display_name || "User avatar"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10">
                    {profile?.display_name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                </span>
              </div>
              <span className="hidden md:inline-flex text-sm font-medium">
                {profile?.display_name || "User"}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[280px] p-2" align="end">
          <div className="flex items-center justify-between gap-2 p-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profile?.display_name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <div className="grid grid-cols-2 gap-2 p-2">
            {profile?.allTimeRank && (
              <div className="flex flex-col items-center justify-center rounded-lg bg-accent/50 p-2 hover:bg-accent transition-colors">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-0.5">
                  <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                  <span>ATR</span>
                </div>
                <span className="text-base font-bold">{profile.allTimeRank}</span>
                <span className="text-xs text-muted-foreground">All Time</span>
              </div>
            )}
            {currentRoundRank?.rank !== undefined && currentRoundRank.rank !== null && (
              <div className="flex flex-col items-center justify-center rounded-lg bg-accent/50 p-2 hover:bg-accent transition-colors">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-0.5">
                  <Trophy className="h-3.5 w-3.5 text-primary" />
                  <span>R{currentRoundRank.roundName}</span>
                </div>
                <span className="text-base font-bold">{currentRoundRank.rank}</span>
                <span className="text-xs text-muted-foreground">Round Rank</span>
              </div>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowSettings(true)}
            className="cursor-pointer flex items-center gap-2 p-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Settings className="h-4 w-4" />
            </span>
            Profile settings
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer flex items-center gap-2 p-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <LogOut className="h-4 w-4" />
            </span>
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
