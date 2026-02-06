import { useState } from 'react';

import Login from './Auth/Login.jsx';

import Register from './Auth/Register.jsx';
import UserProfile from './userprofile/UserProfile.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('profile');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentPage('profile');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
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