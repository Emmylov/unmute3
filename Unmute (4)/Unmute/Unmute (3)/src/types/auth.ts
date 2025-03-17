
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  full_name?: string;
  bio?: string;
  website?: string;
  is_verified?: boolean;
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}
