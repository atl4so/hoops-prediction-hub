import { Card, CardContent } from "@/components/ui/card";
import { FollowButton } from "@/components/users/FollowButton";

interface FollowedUserCardProps {
  user: {
    id: string;
    display_name: string;
    total_points: number;
    points_per_game: number;
  };
  onUserClick: (user: { id: string; display_name: string }) => void;
}

export function FollowedUserCard({ user, onUserClick }: FollowedUserCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p 
              className="font-semibold cursor-pointer hover:text-primary transition-colors"
              onClick={() => onUserClick({
                id: user.id,
                display_name: user.display_name
              })}
            >
              {user.display_name}
            </p>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p className="flex items-center gap-1">
                Total Points: <span className="font-medium text-foreground">{user.total_points}</span>
              </p>
              <p className="flex items-center gap-1">
                PPG: <span className="font-medium text-foreground">{user.points_per_game?.toFixed(1)}</span>
              </p>
            </div>
          </div>
          <FollowButton
            userId={user.id}
            isFollowing={true}
            onFollowChange={() => {}}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </CardContent>
    </Card>
  );
}