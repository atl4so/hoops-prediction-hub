import { ThemeProvider } from "@/components/theme-provider";
import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="euroleague-theme">
      <div className="min-h-screen flex flex-col w-full relative overflow-hidden">
        {/* Basketball court pattern overlay */}
        <div className="fixed inset-0 -z-20 basketball-court-pattern" />
        
        {/* Animated background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 -left-4 w-[40rem] h-[40rem] bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-0 -right-4 w-[35rem] h-[35rem] bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-[30rem] h-[30rem] bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
          
          {/* Animated line patterns */}
          <div className="animated-line" style={{ top: '20%' }} />
          <div className="animated-line" style={{ top: '60%' }} />
          <div className="animated-line-reverse" style={{ top: '40%' }} />
          <div className="animated-line-reverse" style={{ top: '80%' }} />
        </div>
        
        {/* Semi-transparent overlay for better content readability */}
        <div className="fixed inset-0 -z-5 bg-gradient-to-br from-background/90 to-background/80 backdrop-blur-sm" />
        
        {/* Content */}
        <AppHeader />
        <main className="flex-1 relative">
          <div className="container mx-auto p-6 h-full">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}