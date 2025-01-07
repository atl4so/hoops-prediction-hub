import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomAvatarProps {
  url?: string | null;
  fallback?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  onClick?: () => void;
}

export function CustomAvatar({ 
  url, 
  fallback, 
  className,
  size = "md",
  showOnlineStatus = false,
  isOnline = false,
  onClick
}: CustomAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14"
  };

  const dotSizeClasses = {
    sm: "h-2.5 w-2.5",
    md: "h-3 w-3",
    lg: "h-3.5 w-3.5"
  };

  return (
    <div className="relative inline-block" onClick={onClick}>
      <Avatar className={cn(sizeClasses[size], "ring-2 ring-primary/10 ring-offset-2 ring-offset-background", className)}>
        {url ? (
          <AvatarImage src={url} alt={fallback || "User avatar"} />
        ) : null}
        <AvatarFallback>
          {fallback ? (
            <span className="font-medium">{fallback.charAt(0).toUpperCase()}</span>
          ) : (
            <User className={cn(
              size === "sm" ? "h-4 w-4" : "h-6 w-6"
            )} />
          )}
        </AvatarFallback>
      </Avatar>
      
      {showOnlineStatus && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-background",
            dotSizeClasses[size],
            isOnline ? "bg-orange-500" : "bg-muted-foreground/40"
          )}
        />
      )}
    </div>
  );
}