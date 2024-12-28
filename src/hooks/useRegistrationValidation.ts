import { useState } from "react";
import { validateEmail } from "@/utils/validation";
import { checkEmailExists } from "@/utils/authChecks";

export const useRegistrationValidation = () => {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);

  const validateDisplayName = async (displayName: string): Promise<string | null> => {
    if (!displayName) {
      return "Display name is required";
    }
    if (displayName.length < 3) {
      return "Display name must be at least 3 characters long";
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('display_name', displayName)
        .maybeSingle();

      if (error) {
        console.error('Error checking display name:', error);
        return "Error checking display name availability";
      }

      if (data) {
        return "This display name is already taken";
      }

      return null;
    } catch (error) {
      console.error('Error checking display name:', error);
      return "Error checking display name availability";
    }
  };

  const validateRegistrationEmail = async (email: string): Promise<string | null> => {
    const validationError = validateEmail(email);
    if (validationError) {
      return validationError;
    }

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        return "This email is already registered";
      }
      
      return null;
    } catch (error) {
      console.error('Error checking email:', error);
      return "Error checking email availability";
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