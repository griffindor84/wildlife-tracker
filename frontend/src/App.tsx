import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './pages/Navbar';
import Home from './pages/home';
import Aboutus from './pages/Aboutus';
import Reports from './pages/Reports';
import Species from './pages/Species';
import Observations from './pages/Observations';
import AddObservation from './pages/addobservation';
import ContactUs from './pages/contactus';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Settings from './admin/Settings';
import Wildlife from './admin/Wildlife';
import Users from './admin/Users';
import AdminReports from './admin/AdminReports';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isLoaded, isAdmin } = useAuth();
  if (!isLoaded) return <div className="loading">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && (
        <Routes>
          <Route path="/"         element={null} />
          <Route path="/login"    element={null} />
          <Route path="/register" element={null} />
          <Route path="*"         element={<Navbar />} />
        </Routes>
      )}

      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/observations"   element={<ProtectedRoute><Observations /></ProtectedRoute>} />
        <Route path="/addobservation" element={<ProtectedRoute><AddObservation /></ProtectedRoute>} />
        <Route path="/reports"        element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/species"        element={<ProtectedRoute><Species /></ProtectedRoute>} />
        <Route path="/aboutus"        element={<ProtectedRoute><Aboutus /></ProtectedRoute>} />
        <Route path="/contactus"      element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
        <Route path="/profile"        element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        {/* Admin only routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users"     element={<Users />} />
          <Route path="wildlife"  element={<Wildlife />} />
          <Route path="reports"   element={<AdminReports />} />
          <Route path="settings"  element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}