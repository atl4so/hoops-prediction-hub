export const validateUsername = (username: string): string | null => {
  if (username.length < 4) {
    return "Username must be at least 4 characters long";
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return "Username can only contain letters and numbers";
  }
  
  return null;
};

export const normalizeUsername = (username: string): string => {
  return username.toLowerCase();
};