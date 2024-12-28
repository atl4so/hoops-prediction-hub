import { useState } from "react";
import { validateEmail } from "@/utils/validation";
import { supabase } from "@/integrations/supabase/client";
import { checkEmailExists } from "@/utils/authChecks";

export const useRegistrationValidation = () => {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);

  const validateDisplayName = async (displayName: string): Promise<boolean> => {
    if (!displayName) {
      setDisplayNameError("Display name is required");
      return false;
    }
    if (displayName.length < 3) {
      setDisplayNameError("Display name must be at least 3 characters long");
      return false;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('display_name', displayName)
        .maybeSingle();

      if (error) {
        console.error('Error checking display name:', error);
        return false;
      }

      if (data) {
        setDisplayNameError("This display name is already taken");
        return false;
      }

      setDisplayNameError(null);
      return true;
    } catch (error) {
      console.error('Error checking display name:', error);
      setDisplayNameError("Error checking display name availability");
      return false;
    }
  };

  const validateRegistrationEmail = async (email: string): Promise<boolean> => {
    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return false;
    }

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setEmailError("This email is already registered");
        return false;
      }
      
      setEmailError(null);
      return true;
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailError("Error checking email availability");
      return false;
    }
  };

  return {
    emailError,
    displayNameError,
    validateDisplayName,
    validateRegistrationEmail,
    setEmailError,
    setDisplayNameError,
  };
};