import { Link } from "react-router-dom";
import { X } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} euroleague.bet - All rights reserved
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Follow us:
              <a 
                href="https://twitter.com/beteuroleague" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center ml-2 hover:text-primary transition-colors"
                aria-label="Follow us on X (formerly Twitter)"
              >
                <X className="h-4 w-4" />
              </a>
            </div>
            <Link to="/terms" className="text-sm hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}