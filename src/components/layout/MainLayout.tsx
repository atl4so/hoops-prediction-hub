import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeProvider } from "@/components/theme-provider";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-background/95">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <div className="container mx-auto p-6 h-full">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}