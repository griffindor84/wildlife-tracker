import api from './axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Administrator' | 'Ranger';
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
  password: string,
  role?: string
): Promise<AuthResponse> => {
  const res = await api.post('/auth/register', { name, email, password, role });
  return res.data;
};