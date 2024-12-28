import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} euroleague.bet - All rights reserved
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/rules" className="hover:text-primary transition-colors">
              Rules
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}