import { Link } from "react-router-dom";

const XIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24"
    className="fill-current"
  >
    <rect width="24" height="24" fill="none"/>
    <g fill="none" fillRule="evenodd">
      <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
      <path fill="currentColor" d="M19.753 4.659a1 1 0 0 0-1.506-1.317l-5.11 5.84L8.8 3.4A1 1 0 0 0 8 3H4a1 1 0 0 0-.8 1.6l6.437 8.582l-5.39 6.16a1 1 0 0 0 1.506 1.317l5.11-5.841L15.2 20.6a1 1 0 0 0 .8.4h4a1 1 0 0 0 .8-1.6l-6.437-8.582l5.39-6.16ZM16.5 19L6 5h1.5L18 19z"/>
    </g>
  </svg>
);

const FacebookIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24"
    className="fill-current"
  >
    <rect width="24" height="24" fill="none"/>
    <path fill="currentColor" d="M13.458 21.696c4.693-.704 8.292-4.753 8.292-9.642c0-5.385-4.365-9.75-9.75-9.75s-9.75 4.365-9.75 9.75c0 4.89 3.599 8.938 8.292 9.642v-6.798h-2.05a.486.486 0 0 1-.486-.486v-1.843c0-.269.218-.486.486-.486h2.05l-.072-1.943c0-.942.175-2.471 1.342-3.307c.816-.583 1.423-.693 2.397-.693c.845 0 1.426.084 1.81.14l.188.025a.193.193 0 0 1 .168.192v2.04c0 .113-.095.2-.205.194h-.038c-.114.004-.71.029-1.216.029c-.89 0-1.458.406-1.458 1.755v1.568h2.192c.3 0 .529.27.48.566l-.28 1.843a.486.486 0 0 1-.479.406h-1.913z"/>
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Euroleague.bet - All rights reserved
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              Follow us:
              <div className="flex items-center gap-2">
                <a 
                  href="https://www.facebook.com/profile.php?id=61571329508012" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <FacebookIcon />
                </a>
                <a 
                  href="https://twitter.com/beteuroleague" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Follow us on X (formerly Twitter)"
                >
                  <XIcon />
                </a>
              </div>
            </div>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}