import { supabase } from "@/integrations/supabase/client";

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
  });
  
  // If there's no error with OTP, it means the email exists
  return !error || error.status !== 400;
};