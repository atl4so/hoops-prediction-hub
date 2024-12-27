export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email is required";
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  
  return null;
};

export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};