import React, { useState } from 'react';
import { Route, Routes, BrowserRouter, Navigate, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Reports from './pages/reports';
import Species from './pages/species';
import Observations from './pages/observations';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import type { User } from './types';
import Home from './pages/home';

function AppRoutes() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleLogin = (userData: User) => {
    setUser(userData);
    navigate("/"); // 🔥 Redirect to home page
  };

  const handleRegister = (userData: User) => {
    setUser(userData);
    navigate("/"); // 🔥 Redirect to home page
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {user && <Navbar />}

      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />
        <Route path="/species" element={user ? <Species /> : <Navigate to="/login" />} />
        <Route path="/observations" element={user ? <Observations /> : <Navigate to="/login" />} />

        <Route path="/profile" element={user ? <UserProfile user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppRoutes />
  );
}
