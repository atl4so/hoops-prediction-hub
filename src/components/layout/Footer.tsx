import { Link } from "react-router-dom";
import { Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} euroleague.bet - All rights reserved
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              Follow us:
              <div className="flex items-center gap-2">
                <a 
                  href="https://www.facebook.com/profile.php?id=61571329508012" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-primary transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com/beteuroleague" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-primary transition-colors"
                  aria-label="Follow us on X (formerly Twitter)"
                >
                  <img 
                    src="https://cdn.cms-twdigitalassets.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.768.png" 
                    alt="X (formerly Twitter)" 
                    className="h-4 w-4" 
                  />
                </a>
              </div>
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