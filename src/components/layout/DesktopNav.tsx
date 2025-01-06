import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DesktopNavProps {
  menuItems: NavigationItem[];
  currentPath: string;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function DesktopNav({ menuItems, currentPath, isAuthenticated }: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center space-x-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm">
      {menuItems.map((item) => (
        <Button
          key={item.title}
          variant={currentPath === item.href ? "secondary" : "ghost"}
          size="sm"
          asChild
          className={`relative px-4 py-2 transition-all duration-200 
            ${currentPath === item.href ? 
              'bg-primary/10 text-primary hover:bg-primary/20 font-medium' : 
              'hover:bg-primary/5 hover:text-primary'
            }`}
        >
          <Link 
            to={item.href} 
            className="flex items-center gap-2 relative group"
          >
            <item.icon className={`h-4 w-4 transition-colors duration-200 
              ${currentPath === item.href ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} 
            />
            <span className="relative">
              {item.title}
              {currentPath === item.href && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </span>
          </Link>
        </Button>
      ))}
    </nav>
  );
}