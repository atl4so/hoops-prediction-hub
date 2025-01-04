import { Users } from "lucide-react";
import { FollowedUsersList } from "./FollowedUsersList";

interface FollowingSectionProps {
  searchQuery: string;
}

export function FollowingSection({ searchQuery }: FollowingSectionProps) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3">
        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        <h2 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-foreground">
          Users You Follow
        </h2>
      </div>
      <FollowedUsersList searchQuery={searchQuery} />
    </div>
  );
}