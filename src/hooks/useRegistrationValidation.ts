import { validateEmail } from "@/utils/validation";
import { supabase } from "@/integrations/supabase/client";

export const useRegistrationValidation = () => {
  const validateDisplayName = async (displayName: string): Promise<string | null> => {
    try {
      // Check if display name is empty or only whitespace
      const trimmedName = displayName.trim();
      if (!trimmedName) {
        return "Display name is required";
      }

      // Check minimum length after trimming
      if (trimmedName.length < 3) {
        return "Display name must be at least 3 characters long";
      }

      // Check for any existing display name that matches (case insensitive)
      const { data: existingProfiles, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('display_name_lower', trimmedName.toLowerCase());

      if (error) {
        console.error('Error checking display name:', error);
        throw new Error("Error checking display name availability");
      }

      // Check if any profile exists with this name
      if (existingProfiles && existingProfiles.length > 0) {
        return "This display name is already taken";
      }

      // No match found, name is available
      return null;
    } catch (error) {
      console.error('Error in validateDisplayName:', error);
      throw error;
    }
  };

  const validateRegistrationEmail = async (email: string): Promise<string | null> => {
    try {
      // Basic email format validation
      const validationError = validateEmail(email);
      if (validationError) {
        return validationError;
      }

      // Normalize email
      const normalizedEmail = email.toLowerCase().trim();

      // Check if email is already registered
      const { data: existingProfiles, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', normalizedEmail);

      if (error) {
        console.error('Error checking email:', error);
        throw new Error("Error checking email availability");
      }

      if (existingProfiles && existingProfiles.length > 0) {
        return "This email is already registered";
      }

      return null;
    } catch (error) {
      console.error('Error in validateRegistrationEmail:', error);
      throw error;
    }
  };

  return {
    validateDisplayName,
    validateRegistrationEmail,
  };
};