import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DesktopNavProps {
  menuItems: NavigationItem[];
  isAuthenticated: boolean;
  isAdmin?: boolean;
}

export function DesktopNav({ menuItems, isAuthenticated, isAdmin }: DesktopNavProps) {
  if (!isAuthenticated) return null;

  return (
    <nav className="hidden md:flex md:flex-1 items-center space-x-2">
      {menuItems.map((item) => (
        <Button
          key={item.title}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2",
            "md:w-auto"
          )}
          asChild
        >
          <Link to={item.href}>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        </Button>
      ))}
      {isAdmin && (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2",
            "md:w-auto"
          )}
          asChild
        >
          <Link to="/admin">
            <span>Admin</span>
          </Link>
        </Button>
      )}
    </nav>
  );
}