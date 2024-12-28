import { ThemeProvider } from "@/components/theme-provider";
import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-background to-background/95">
        <AppHeader />
        <main className="flex-1 overflow-hidden">
          <div className="container mx-auto p-6 h-full">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}