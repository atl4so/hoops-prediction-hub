export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  totalPoints: number;
  createdAt: Date;
  isAdmin: boolean;
}

export interface UserRegistration {
  email: string;
  password: string;
  displayName: string;
}