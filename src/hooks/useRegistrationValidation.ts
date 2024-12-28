import { validateEmail } from "@/utils/validation";
import { supabase } from "@/integrations/supabase/client";

export const useRegistrationValidation = () => {
  const validateDisplayName = async (displayName: string): Promise<string | null> => {
    // Check if display name is empty or only whitespace
    if (!displayName || displayName.trim() === '') {
      return "Display name is required";
    }

    // Check minimum length after trimming
    if (displayName.trim().length < 3) {
      return "Display name must be at least 3 characters long";
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .ilike('display_name', displayName.trim())
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
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error('Error checking email:', error);
        return "Error checking email availability";
      }

      if (data) {
        return "This email is already registered";
      }

      return null;
    } catch (error) {
      console.error('Error checking email:', error);
      return "Error checking email availability";
    }
  };

  return {
    validateDisplayName,
    validateRegistrationEmail,
  };
};