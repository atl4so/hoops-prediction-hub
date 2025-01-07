import { Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface UserDisplayNameProps {
  userId: string;
  displayName: string;
  className?: string;
  showStatus?: boolean;
  onClick?: () => void;
}

export function UserDisplayName({ userId, displayName, className, showStatus = true, onClick }: UserDisplayNameProps) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Subscribe to presence updates for this user
    const channel = supabase.channel(`presence_${userId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const userPresence = state[userId];
        setIsOnline(!!userPresence?.length);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key === userId) setIsOnline(true);
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key === userId) setIsOnline(false);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track own presence if this is the current user
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.id === userId) {
            await channel.track({
              online_at: new Date().toISOString(),
            });
          }
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <div 
      className={cn("flex items-center gap-1.5", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <span className="font-medium">{displayName}</span>
      {showStatus && (
        <Circle
          className={cn(
            "h-2 w-2 fill-current",
            isOnline ? "text-orange-500" : "text-gray-300"
          )}
        />
      )}
    </div>
  );
}