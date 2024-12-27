import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={sidebarVisible}>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-background/95">
          <AppSidebar visible={sidebarVisible} onVisibilityChange={setSidebarVisible} />
          <main className="flex-1 overflow-hidden relative">
            {!sidebarVisible && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 z-50"
                onClick={() => setSidebarVisible(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="container mx-auto p-6 h-full">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}