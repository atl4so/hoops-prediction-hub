import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
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

export function ProfileMenu() {
  const session = useSession();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const { data: profile, isLoading } = useUserProfile(session?.user?.id || null);

  const handleLogout = async () => {
    navigate("/login");
  };

  if (!session || isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;

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