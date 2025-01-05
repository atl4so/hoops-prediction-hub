import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayerInfoProps {
  displayName: string;
  avatarUrl?: string;
}

export function PlayerInfo({ displayName, avatarUrl }: PlayerInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <span className="font-semibold text-base">{displayName}</span>
    </div>
  );
}