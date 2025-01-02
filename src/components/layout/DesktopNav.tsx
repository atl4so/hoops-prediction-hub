import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavigationItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  className?: string;
}

interface DesktopNavProps {
  menuItems: NavigationItem[];
  currentPath: string;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function DesktopNav({ menuItems, currentPath, isAuthenticated }: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {menuItems.map((item) => (
        <Button
          key={item.title}
          variant={currentPath === item.path ? "secondary" : "ghost"}
          size="sm"
          asChild
          className={`relative px-4 py-2 transition-all duration-200 hover:bg-primary/10 
            ${currentPath === item.path ? 
              'bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary font-medium' : 
              'hover:text-primary'
            } 
            ${item.className || ''}`}
        >
          <Link 
            to={item.path} 
            className="flex items-center gap-2 relative group"
          >
            <item.icon className={`h-4 w-4 transition-colors duration-200 
              ${currentPath === item.path ? 'text-primary' : 'group-hover:text-primary'}`} 
            />
            <span className="relative">
              {item.title}
              {currentPath === item.path && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </span>
          </Link>
        </Button>
      ))}
    </nav>
  );
}