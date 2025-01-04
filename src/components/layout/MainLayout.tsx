import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-10" />
      <AppHeader />
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto p-6 h-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}