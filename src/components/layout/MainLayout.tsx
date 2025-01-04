import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Background patterns and effects */}
      <div className="fixed inset-0 -z-20 basketball-court-pattern" />
      
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-[40rem] h-[40rem] bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:opacity-10" />
        <div className="absolute top-0 -right-4 w-[35rem] h-[35rem] bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:opacity-10" />
        <div className="absolute -bottom-8 left-20 w-[30rem] h-[30rem] bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:opacity-10" />
        
        <div className="animated-line dark:opacity-10" style={{ top: '20%' }} />
        <div className="animated-line dark:opacity-10" style={{ top: '60%' }} />
        <div className="animated-line-reverse dark:opacity-10" style={{ top: '40%' }} />
        <div className="animated-line-reverse dark:opacity-10" style={{ top: '80%' }} />
      </div>
      
      {/* Semi-transparent background overlay */}
      <div className="fixed inset-0 -z-5 bg-gradient-to-br from-background/90 to-background/80 backdrop-blur-sm" />
      
      {/* Content */}
      <AppHeader />
      <main className="flex-1 relative">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}