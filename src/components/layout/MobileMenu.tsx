import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileMenuProps {
  menuItems: NavigationItem[];
  isAuthenticated: boolean;
  isAdmin?: boolean;
  onLogout: () => void;
}

export function MobileMenu({ menuItems, isAuthenticated, isAdmin, onLogout }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-[240px] p-0"
        onPointerDownOutside={() => setOpen(false)}
        onEscapeKeyDown={() => setOpen(false)}
      >
        <ScrollArea className="h-full py-6">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                className="w-full justify-start gap-2"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link to={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
            {isAdmin && (
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link to="/admin">
                  <span>Admin</span>
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
            >
              Logout
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}