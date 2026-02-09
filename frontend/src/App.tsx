import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import type { User } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'profile'>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('profile');
  };

  const handleRegister = (userData: User) => {
    setUser(userData);
    setCurrentPage('profile');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page: 'login' | 'register' | 'profile') => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === 'login' && (
        <Login
          onNavigate={handleNavigate}
          onLogin={handleLogin}
        />
      )}

      {currentPage === 'register' && (
        <Register
          onNavigate={handleNavigate}
          onRegister={handleRegister}
        />
      )}

      {currentPage === 'profile' && user && (
        <UserProfile
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}