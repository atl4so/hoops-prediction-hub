import type { Database } from "@/integrations/supabase/types";

export type BackgroundSetting = Database["public"]["Tables"]["background_settings"]["Row"];