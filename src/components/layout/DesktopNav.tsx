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
    <nav className="hidden md:flex items-center space-x-1 bg-background/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-border/50 shadow-sm">
      {menuItems.map((item) => (
        <Button
          key={item.title}
          variant={currentPath === item.path ? "secondary" : "ghost"}
          size="sm"
          asChild
          className={`relative px-4 py-2 transition-all duration-200 hover:bg-primary/10 
            ${currentPath === item.path ? 
              'bg-background text-foreground hover:bg-background/90 font-medium' : 
              'hover:text-primary'
            }`}
        >
          <Link 
            to={item.path} 
            className="flex items-center gap-2 relative group"
          >
            <item.icon className={`h-4 w-4 transition-colors duration-200 
              ${currentPath === item.path ? 'text-foreground' : 'group-hover:text-primary'}`} 
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