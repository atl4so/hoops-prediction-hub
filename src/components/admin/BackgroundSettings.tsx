import type { BackgroundSetting } from "@/types/background";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function BackgroundSettings() {
  const [settings, setSettings] = useState<BackgroundSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('background_settings')
        .select('*');

      if (error) {
        toast.error("Failed to load background settings");
        console.error(error);
      } else {
        setSettings(data);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Background Settings</h1>
      <ul>
        {settings.map(setting => (
          <li key={setting.id}>
            <img src={setting.url} alt="Background" />
            <p>Opacity: {setting.opacity}</p>
            <p>Active: {setting.is_active ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
