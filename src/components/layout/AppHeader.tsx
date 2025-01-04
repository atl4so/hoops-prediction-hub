import { Link } from "react-router-dom";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/basketball-favicon.png" alt="Logo" className="logo" />
        </Link>
      </div>
    </header>
  );
}