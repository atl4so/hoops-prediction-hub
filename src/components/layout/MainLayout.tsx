import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Simple gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-orange-50 via-orange-50/80 to-orange-100/60" />
      
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