import { useState } from "react";
import { Input } from "@/components/ui/input";
import { UserPermissionsList } from "./permissions/UserPermissionsList";
import { PermittedUsersList } from "./permissions/PermittedUsersList";

export function UserPermissions() {
  const [searchEmail, setSearchEmail] = useState("");

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Input
          placeholder="Search user by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>

      <PermittedUsersList />
      
      <div className="space-y-4">
        <UserPermissionsList searchEmail={searchEmail} />
      </div>
    </div>
  );
}