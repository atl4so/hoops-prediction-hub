import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogoUpload } from "@/components/upload/LogoUpload";
import { toast } from "sonner";

export function DesignAssets() {
  const [backgroundLogo, setBackgroundLogo] = useState<string | null>("/logocourt.jpg");

  const handleLogoChange = (url: string | null) => {
    setBackgroundLogo(url);
    if (url) {
      toast.success("Background logo updated successfully");
    } else {
      toast.success("Background logo removed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Assets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Background Logo</h3>
          <p className="text-sm text-muted-foreground">
            Upload a background logo to be used in the site's design. 
            Recommended size: 1920x1080px. Max file size: 5MB.
          </p>
          <LogoUpload
            currentLogoUrl={backgroundLogo}
            onLogoChange={handleLogoChange}
          />
          {backgroundLogo && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Preview:</h4>
              <div className="relative w-full h-48 bg-accent rounded-lg overflow-hidden">
                <img
                  src={backgroundLogo}
                  alt="Background Logo Preview"
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}