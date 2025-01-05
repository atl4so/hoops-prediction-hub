import { FollowedUsersList } from "./FollowedUsersList";

interface FollowingSectionProps {
  searchQuery: string;
}

export function FollowingSection({ searchQuery }: FollowingSectionProps) {
  return (
    <div className="animate-fade-in">
      <FollowedUsersList searchQuery={searchQuery} />
    </div>
  );
}