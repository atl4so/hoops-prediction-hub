import { ThemeProvider } from "@/components/theme-provider";
import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="euroleague-theme">
      <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-background to-background/95 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-[40rem] h-[40rem] bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-0 -right-4 w-[35rem] h-[35rem] bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-[30rem] h-[30rem] bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        </div>
        
        {/* Content */}
        <AppHeader />
        <main className="flex-1 overflow-hidden">
          <div className="container mx-auto p-6 h-full relative">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}