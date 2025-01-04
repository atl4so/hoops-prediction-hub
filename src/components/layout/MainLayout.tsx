import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Simple background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-orange-50/30 to-orange-100/20 dark:from-green-950/30 dark:to-green-900/20" />
      
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