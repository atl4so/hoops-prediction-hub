import { FollowedUsersList } from "./FollowedUsersList";

export function FollowingSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Following</h2>
      <FollowedUsersList />
    </div>
  );
}