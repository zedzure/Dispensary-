
export interface User {
  name: string;
  email: string;
  memberSince: string;
  avatarUrl: string;
  points: number;
  nextReward: number;
  role: 'customer' | 'budtender' | 'admin';
  bio?: string;
}
