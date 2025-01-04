import { Users } from "lucide-react";
import { FollowedUsersList } from "./FollowedUsersList";

interface FollowingSectionProps {
  searchQuery: string;
}

export function FollowingSection({ searchQuery }: FollowingSectionProps) {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Users You Follow</h2>
      </div>
      <FollowedUsersList searchQuery={searchQuery} />
    </div>
  );
}