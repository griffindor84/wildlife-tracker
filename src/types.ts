export interface User {
  name: string;
  email: string;
  joinDate?: string;
  role?: string;
  memberSince?: string;
  about?: string;
  avatarUrl?: string;
}
// Shared TypeScript types for the authentication system

export interface UserData {
  name: string;
  email: string;
  joinDate: string;
  role?: string;
  about?: string;
  avatarUrl?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type PageType = 'login' | 'register' | 'profile';