import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (session) {
      navigate('/predict');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 relative overflow-hidden px-4 sm:px-6 animate-fade-in">
      <div className="flex gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="lg">
              Log In
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[300px] p-4 bg-white">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  button: {
                    background: 'rgb(249 115 22)',
                    color: 'white',
                    borderRadius: '6px',
                  },
                  anchor: {
                    color: 'rgb(249 115 22)',
                  },
                },
              }}
              theme="default"
              providers={[]}
            />
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg">
              Get Started
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[300px] p-4 bg-white">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  button: {
                    background: 'rgb(249 115 22)',
                    color: 'white',
                    borderRadius: '6px',
                  },
                  anchor: {
                    color: 'rgb(249 115 22)',
                  },
                },
              }}
              theme="default"
              providers={[]}
              view="sign_up"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Index;