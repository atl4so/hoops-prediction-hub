import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useRegistrationValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateDisplayName = async (displayName: string): Promise<boolean> => {
    if (!displayName || displayName.length < 3) {
      return false;
    }

    try {
      setIsValidating(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .ilike("display_name_lower", displayName.toLowerCase());

      if (error) {
        console.error("Error checking display name:", error);
        return false;
      }

      return data.length === 0;
    } catch (error) {
      console.error("Error in validateDisplayName:", error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const validateEmail = async (email: string): Promise<boolean> => {
    if (!email) return false;

    try {
      setIsValidating(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email.toLowerCase());

      if (error) {
        console.error("Error checking email:", error);
        return false;
      }

      return data.length === 0;
    } catch (error) {
      console.error("Error in validateEmail:", error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    validateDisplayName,
    validateEmail,
    isValidating,
  };
};