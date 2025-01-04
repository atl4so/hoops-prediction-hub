import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Background patterns */}
      <div className="fixed inset-0 -z-10 basketball-court-pattern" />
      
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-[40rem] h-[40rem] bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:opacity-10" />
        <div className="absolute top-0 -right-4 w-[35rem] h-[35rem] bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:opacity-10" />
        <div className="absolute -bottom-8 left-20 w-[30rem] h-[30rem] bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:opacity-10" />
      </div>
      
      {/* Content */}
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}