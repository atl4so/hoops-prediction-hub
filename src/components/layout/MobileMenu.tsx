import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileMenuProps {
  menuItems: NavigationItem[];
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function MobileMenu({ menuItems, isAuthenticated, onLogout }: MobileMenuProps) {
  if (!isAuthenticated) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {menuItems.map((item) => (
          <DropdownMenuItem key={item.title} asChild>
            <Link to={item.href} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={onLogout} className="text-red-500">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}