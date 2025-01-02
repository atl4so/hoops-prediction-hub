import { Users } from "lucide-react";
import { FollowedUsersList } from "./FollowedUsersList";

interface FollowingSectionProps {
  searchQuery: string;
}

export function FollowingSection({ searchQuery }: FollowingSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold tracking-tight">Following</h2>
      </div>
      <FollowedUsersList searchQuery={searchQuery} />
    </div>
  );
}