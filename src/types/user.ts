export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  totalPoints: number;
  createdAt: Date;
  isAdmin: boolean;
}

export interface UserRegistration {
  username: string;
  password: string;
  displayName: string;
}