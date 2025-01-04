import { Card, CardContent } from "@/components/ui/card";
import { FollowButton } from "@/components/users/FollowButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FollowedUserCardProps {
  user: {
    id: string;
    display_name: string;
    total_points: number;
    points_per_game: number;
    avatar_url?: string;
  };
  onUserClick: (user: { id: string; display_name: string }) => void;
  onFollowChange: () => void;
  isFollowing: boolean;
}

export function FollowedUserCard({ user, onUserClick, onFollowChange, isFollowing }: FollowedUserCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm border-muted/50 animate-fade-in">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar 
            className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-primary/10 ring-offset-2 ring-offset-background transition-all duration-300 group-hover:ring-primary/20"
            onClick={() => onUserClick({
              id: user.id,
              display_name: user.display_name
            })}
          >
            {user.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.display_name} />
            ) : null}
            <AvatarFallback>
              <User className="h-5 w-5 sm:h-6 sm:w-6" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p 
              className="font-semibold truncate cursor-pointer hover:text-primary transition-colors text-sm sm:text-base"
              onClick={() => onUserClick({
                id: user.id,
                display_name: user.display_name
              })}
            >
              {user.display_name}
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {user.total_points} pts
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">
                {user.points_per_game?.toFixed(1)} PPG
              </Badge>
            </div>
          </div>
          
          <FollowButton
            userId={user.id}
            isFollowing={isFollowing}
            onFollowChange={onFollowChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}