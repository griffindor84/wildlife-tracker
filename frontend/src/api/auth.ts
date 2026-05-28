import api from './axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Administrator' | 'Ranger';
  created_at?: string;
  about?: string;
  avatarUrl?: string;
  user_metadata?: {
    full_name?: string;
    role?: string;
    about?: string;
    avatar_url?: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
};

export const getCurrentUser = async (): Promise<{ user: User }> => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const updateCurrentUser = async (
  data: Pick<User, 'name' | 'about' | 'avatarUrl'>
): Promise<{ user: User }> => {
  const res = await api.patch('/auth/me', data);
  return res.data;
};
