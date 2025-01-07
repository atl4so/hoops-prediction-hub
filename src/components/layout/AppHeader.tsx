import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MobileMenu } from "./MobileMenu";
import { DesktopNav } from "./DesktopNav";
import { navigationItems } from "./NavigationItems";
import { ProfileMenu } from "../profile/ProfileMenu";
import { Settings } from "lucide-react";

const BASKETBALL_ICON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCI+PGcgZmlsbD0iIzc4YTNhZCI+PHBhdGggZD0iTTg2LjI2IDc4LjVjLjgxLjE3IDEuMzEuNzYuNzkgMi4wOWMtLjE5LjUtLjUxIDEuMDUtLjU4IDEuNThjLjM0LS4wNS40OS0uMjUuNzEtLjQ5Yy4zMS0uMzMuNjctLjYxLjk4LS45NGMuNjgtLjcgMS40NC0xLjYgMS44Mi0yLjVjLjE0LS4zMi4yMy0uNjQuNC0uOTVjLjI1LS40NC42MS0uOS40NC0xLjQ0Yy0uMjItLjctMS4zNS0uNTMtMi0uNTNzLTEuMzgtLjEtMiAuMTNjLS43Ny4yOC0xLjU4LjcyLTIuMjkgMS4xNmMtLjU4LjM4LTEuMzUuNjQtMS43OCAxLjIyYy0uMTYuMjMtLjE1LjQ0LS4wNS42OWMuMS4yNC4wNS40Ny4xLjc1Yy4zMy4wMi42NC0uMzYuOTUtLjQ3Yy43NS0uMjggMS43Ni0uNDYgMi41MS0uMyIvPjxwYXRoIGQ9Ik05Ny4yOCA2Ny4zNGExLjYgMS42IDAgMCAwLTIuMjQuMjVjLS4zOS40OS02LjAyIDcuNzMtMTEuMjkgMjAuMzdjLS45LTEuOTktMS44OC0zLjk0LTIuOTMtNS44OGM0LTUuMDkgNi43NS03LjgxIDYuODMtNy44OGMuNjMtLjYxLjY1LTEuNjIuMDMtMi4yNmMtLjYxLS42NC0xLjYyLS42NS0yLjI1LS4wNGMtLjA3LjA3LTIuNjEgMi41OC02LjMxIDcuMmMtLjg4LTEuNDgtMS44Mi0yLjk2LTIuODMtNC40NmMtLjQyLS42Mi0xLjI3LS43OS0xLjg5LS4zNmMtLjYzLjQyLS43OSAxLjI3LS4zNyAxLjg5YTg4IDg4IDAgMCAxIDMuMjggNS4yNmExNDYgMTQ2IDAgMCAwLTguNzYgMTIuODNjLTIuODQtNS40LTUuNDktOS40My03LjU0LTEyLjIxYzEuNDEtMS42NiAyLjI3LTIuNTEgMi4zMS0yLjU0Yy42My0uNjEuNjQtMS42Mi4wMy0yLjI2Yy0uNjEtLjYzLTEuNjMtLjY0LTIuMjYtLjAzYy0uMTEuMTItLjg4Ljg4LTIuMDcgMi4yNGMtMS4xMi0xLjM1LTEuODQtMi4xMS0xLjk1LTIuMjJjLS42Mi0uNjItMS42My0uNjMtMi4yNS0uMDFzLS42MyAxLjYzLS4wMSAyLjI2Yy4wMy4wMy44Mi44NSAyLjEyIDIuNDljLTEuOTQgMi40NC00LjQzIDUuODEtNy4xNSAxMC4yYy0zLjI5LTYuMjItNi4yOS0xMC45MS04LjM3LTEzLjljLjQ1LS43Ljg3LTEuNCAxLjM1LTIuMTFjLjQyLS42Mi4yNS0xLjQ3LS4zNy0xLjg5cy0xLjQ3LS4yNi0xLjg5LjM2Yy0uMjguNDItLjUzLjg0LS44IDEuMjVjLS42NC0uODYtMS4wNi0xLjM5LTEuMTYtMS41Yy0uNTctLjY4LTEuNTctLjc4LTIuMjQtLjIyYTEuNTkgMS41OSAwIDAgMC0uMjMgMi4yNGMuMDMuMDQuNjkuODcgMS43NyAyLjM4Yy0xLjggMi45Ny0zLjM0IDUuOTMtNC43NCA4Ljk5Yy01LjIzLTEyLjUzLTEwLjgyLTE5LjctMTEuMjEtMjAuMTlhMS41OSAxLjU5IDAgMCAwLTIuMjQtLjI1Yy0uNjkuNTUtLjggMS41NS0uMjUgMi4yNGMuMTYuMiAxNS44NCAyMC4yNiAxOS4xNiA1Mi41N2MuMDQuNDQuMjYuOC41NyAxLjA2YzEuMDEgMS40NCAzLjM2IDIuNDUgNi4yMSAzLjE1Yy4yMi4xMS40NS4xOS43MS4xOWMuMDEgMCAuMDQtLjAxLjA2LS4wMWMyLjgzLjYyIDYuMDcuOTYgOSAxLjFjLjE1LjA0LjI5LjA3LjQ0LjA3Yy4wOSAwIC4xNy0uMDMuMjYtLjA0YTY3IDY3IDAgMCAwIDUuNDItLjAxYy4wOS4wMi4xNy4wNC4yNy4wNGMuMTQgMCAuMjktLjAyLjQzLS4wNmMuMDEgMCAuMDItLjAyLjA0LS4wMmMyLjg5LS4xNSA2LjA3LS40OCA4Ljg3LTEuMDljLjAxIDAgLjAzLjAxLjA1LjAxYy4yNiAwIC40OS0uMDguNzItLjE5YzIuODYtLjcgNS4yLTEuNzEgNi4yMS0zLjE1Yy4zMi0uMjYuNTQtLjYyLjU4LTEuMDZjMy4zMy0zMi4zMSAxOS01Mi4zNyAxOS4xNy01Mi41N2MuNTEtLjY3LjQtMS42OC0uMjktMi4yM003OS4wMSA4NC40NWMxLjIzIDIuMzEgMi4zMyA0LjY2IDMuMzMgNy4wOGMtMS4xNiAzLjA3LTIuMjcgNi40My0zLjI3IDEwLjAzYy0xLjM0IDIuNTYtMi41OSA1LjE3LTMuNzggNy44MWMtMS42Ni00LjQtMy4zNi04LjI5LTUuMDQtMTEuNzRjMy4wOS01LjIyIDYuMTItOS42NSA4Ljc2LTEzLjE4bS0xNi4zNSA0MC4wNmMtLjctMi40NS0xLjQ0LTQuOC0yLjItNy4wOWExNTEgMTUxIDAgMCAxIDcuODQtMTYuNGMxLjczIDMuNjkgMy40NiA3Ljg5IDUuMTIgMTIuNmMtMS4zNyAzLjMtMi42NCA2LjY1LTMuNzggMTAuMDJjLTEuODguNC00LjIzLjcxLTYuOTguODdtLTMuNzUtMzkuODdjMi4xMSAyLjk1IDQuODMgNy4yMiA3LjcgMTIuOWMtMi42MiA0LjU3LTUuMjUgOS42OS03LjcyIDE1LjM1Yy0yLjM4LTYuNTYtNC45My0xMi4zOC03LjQtMTcuMzRjMi44LTQuNjUgNS4zOC04LjMgNy40Mi0xMC45MW0tMTEuNiAzOS4wMmMtMS4xNy00LjEtMi41Mi04LjE0LTQuMDEtMTIuMTVjMi4wNy00LjczIDQuMTgtOC45MiA2LjIzLTEyLjU4YzIuNTYgNS4zIDUuMTYgMTEuNDYgNy41NCAxOC40MWMtLjkyIDIuMzItMS44MSA0LjcxLTIuNjUgNy4xOWMtMi44MS0uMTctNS4xOS0uNDgtNy4xMS0uODdtLTcuNzYtNDIuMzdjMi4xNSAzLjIyIDUuMDkgNy45OSA4LjI2IDE0LjE1Yy0yIDMuNDQtNC4wNyA3LjM4LTYuMTMgMTEuODRjLTEuOS00Ljc0LTQuMDMtOS40NS02LjQ1LTE0LjJjLS4wNC0uMDctLjEtLjEyLS4xNS0uMTljLS4xOS0uNTItLjM4LTEuMDQtLjU2LTEuNTVhODIgODIgMCAwIDEgNS4wMy0xMC4wNW0yLjEyIDQwLjIyYy0uMTctMS41OS0uMzktMy4xMy0uNi00LjY2Yy4xNC0uMzQuMjctLjY2LjQxLS45OWMuNzkgMi4yNiAxLjUxIDQuNTMgMi4xOSA2LjgyYy0xLjExLS40MS0xLjgxLS44My0yLTEuMTdtMTYuMDggMy4xMmMuMy0uODMuNTktMS42Ni44OC0yLjQ3Yy4yNS44MS40OSAxLjY0LjczIDIuNDdjLS4zIDAtLjYuMDEtLjkxLjAxYy0uMjMgMC0uNDYtLjAxLS43LS4wMW0xNS42NC0yLjAxYy41MS0xLjQ0IDEuMDQtMi44OCAxLjU5LTQuMzFjLjE2LjUuMzIuOTguNDggMS40OWMtLjA3LjU3LS4xNSAxLjExLS4yMSAxLjY5Yy0uMTguMzQtLjgxLjczLTEuODYgMS4xMyIvPjxwYXRoIGQ9Ik0yOS45OSA4MS4xM2MtLjA1LS4xOS0uMDgtLjM4LS4xNC0uNTdjLS4wNy0uMTktLjE1LS4zNi0uMi0uNTVjLS4wOS0uMzYtLjE3LS43My0uMTYtMS4xMWMuMDQtLjgxLjY1LTEuMDMgMS4zNy0uODZjMS4xOS4yNyA2LjA1IDIuNzggNi42Ni42M2MuMy0xLjA3LTEuMjEtMS4yMS0xLjg2LTEuNGMtLjczLS4yMi0xLjM2LS4zOS0yLjEzLS40NmMtMS41Ny0uMTMtMy4wMS0uOTUtNC40OC0xLjQ1Yy0uMzYtLjEyLTMuMDQtMS4wOS0yLjg1IDBjLjA1LjI2LjE4LjQ3LjIuNzRjLjA0LjM4LjExLjc1LjI4IDEuMWMuNDMuOSAxLjEgMS42MyAxLjYxIDIuNDdzLjUgMi4wMiAxLjQzIDIuNTdjLjIxLjEyLjQ1LjE5LjUyLS4wNmMuMDctLjI0LS4wOC0uNTgtLjE2LS43OWMtLjA0LS4wOS0uMDctLjE4LS4wOS0uMjYiLz48L2c+PHBhdGggZmlsbD0iI2Y3OTMyOSIgZD0iTTU4LjQ2IDQ0LjhjLTIyLjg1IDAtNDEuMzcgOC40OC00MS4zNyAxOC45NWMwIDEwLjQ2IDE4LjUzIDE4Ljk1IDQxLjM3IDE4Ljk1YzIyLjg2IDAgNDEuMzctOC40OSA0MS4zNy0xOC45NWMwLTEwLjQ3LTE4LjUyLTE4Ljk1LTQxLjM3LTE4Ljk1bTAgMzAuMjVjLTE3LjU1IDAtMzEuNzktNS4zMy0zMS43OS0xMS45czE0LjIzLTExLjkgMzEuNzktMTEuOXMzMS43OSA1LjMzIDMxLjc5IDExLjlzLTE0LjIzIDExLjktMzEuNzkgMTEuOSIvPjxkZWZzPjxlbGxpcHNlIGlkPSJub3RvVjFCYXNrZXRiYWxsMCIgY3g9Ijc5LjY2IiBjeT0iMzYuNDUiIHJ4PSIzNy4yNSIgcnk9IjM2LjE4Ii8+PC9kZWZzPjx1c2UgZmlsbD0iI2VkNmMzMCIgaHJlZj0iI25vdG9WMUJhc2tldGJhbGwwIi8+PGNsaXBQYXRoIGlkPSJub3RvVjFCYXNrZXRiYWxsMSI+PHVzZSBocmVmPSIjbm90b1YxQmFza2V0YmFsbDAiLz48L2NsaXBQYXRoPjxnIGZpbGw9IiNmNzkzMjkiIGNsaXAtcGF0aD0idXJsKCNub3RvVjFCYXNrZXRiYWxsMSkiPjxwYXRoIGQ9Ik03MS44OSA3NC42NFM1MC4xNiA1MS4zMyA1OC43IDE3LjYyYzMuNTUtMTQgMTQuOTktMTguMSAxNC45OS0xOC4xaDcuODlzLTE1LjY1IDIuOTktMTguOSAyMC4zN2MtNS45NyAzMS44NiAyMC45MyA1NS42NCAyMC45MyA1NS42NHoiLz48cGF0aCBkPSJNNTUuMSA3LjQycy0uNzkgNi4xOSA3LjQ2IDYuMTljMTcuMzQgMCAyNy4wMi0xMS4yOCA0MC45LTcuNzNsLTcuMjMtMy42MnMtNC4xNi0uNzktNy43OC4zN3MtMTYuNDEgNy43Ni0yNC40MyA3Ljg5Yy04LjU0LjEzLTUuMTItNS44Mi01LjEyLTUuODJ6TTQxLjEzIDQ3LjY5czMuMjEtMTkuMjYgMTcuOTItMjAuODRjMTIuMzktMS4zMyAyMS4xNyA0LjUgMjkuNTkgMTAuNTljMTUuMTcgMTAuOTggMjIuMzEgMjQuOTMgMjIuMzEgMjQuOTNsLTUuMiA3Ljc2cy0zLjk5LTEyLjUxLTIxLjU0LTI4Ljg2Yy02LjYxLTYuMTUtMTUuNzItMTAuOTktMjUuMTUtMTAuMDhjLTE0LjgzIDEuNDQtMTIuODUgMjYuNS0xMi44NSAyNi41eiIvPjxwYXRoIGQ9Ik0zOS44MiAyNS44czUuNi03LjM1IDIwLjgtOC42N2MzNS41MS0zLjA2IDU5Ljk4IDIyLjE4IDU5Ljk4IDIyLjE4bDEuOSAxMi4wMlM5NC42IDE4LjM4IDYwLjM1IDIxLjAxQzQzLjggMjIuMjggMzkuODEgMzIuNDIgMzkuODEgMzIuNDJWMjUuOHoiLz48L2c+PGVsbGlwc2UgY3g9Ijc5LjY2IiBjeT0iMzYuNDUiIGZpbGw9Im5vbmUiIHJ4PSIzNy4yNSIgcnk9IjM2LjE4Ii8+PC9zdmc+";

export function AppHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const loadNavItems = async () => {
      let items = [...navigationItems];
      if (isAuthenticated) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email === 'likasvy@gmail.com') {
          items = [
            ...items,
            {
              title: "Admin",
              href: "/admin",
              icon: Settings,
              public: false
            },
          ];
        }
      } else {
        items = items.filter(item => item.public);
      }
      setMenuItems(items);
    };

    loadNavItems();
  }, [isAuthenticated]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center gap-6">
          <MobileMenu 
            menuItems={menuItems}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
          
          <Link 
            to={isAuthenticated ? "/overview" : "/"} 
            className="flex items-center gap-2"
          >
            <img 
              src={BASKETBALL_ICON} 
              alt="Basketball" 
              className="w-6 h-6"
              loading="eager"
              fetchPriority="high"
            />
            <span className="font-bold text-lg">Euroleague.bet</span>
          </Link>

          <DesktopNav 
            menuItems={menuItems}
            currentPath={location.pathname}
            isAuthenticated={isAuthenticated}
          />
        </div>

        <div className="flex items-center justify-end">
          {isAuthenticated && <ProfileMenu />}
        </div>
      </div>
    </header>
  );
}