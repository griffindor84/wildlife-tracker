import React, { useState } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';


import Navbar from './components/Navbar';
import Reports from './pages/reports';
import Species from './pages/species';
import Observations from './pages/observations';
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

  // If user is in auth flow, show Login/Register/Profile
  if (currentPage === 'login') {
    return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
  }
  if (currentPage === 'register') {
    return <Register onNavigate={handleNavigate} onRegister={handleRegister} />;
  }
  if (currentPage === 'profile' && user) {
    return <UserProfile user={user} onLogout={handleLogout} />;
  }

  // Main app with Navbar and pages
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Reports />} /> {/* Reports as landing page */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/species" element={<Species />} />
        <Route path="/observations" element={<Observations />} />
      </Routes>
    </BrowserRouter>
  );
}
