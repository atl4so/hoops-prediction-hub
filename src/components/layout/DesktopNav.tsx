import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavigationItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface DesktopNavProps {
  menuItems: NavigationItem[];
  currentPath: string;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function DesktopNav({ menuItems, currentPath, isAuthenticated, onLogout }: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center space-x-4">
      {menuItems.map((item) => (
        <Button
          key={item.title}
          variant={currentPath === item.path ? "secondary" : "ghost"}
          size="sm"
          asChild
        >
          <Link to={item.path} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
      {isAuthenticated && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      )}
    </nav>
  );
}