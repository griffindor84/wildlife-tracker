import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, signOut, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="nav-brand">
        <span className="logo">🐾</span>
        <span className="brand-name">Wildpath</span>
      </div>

      {/* Hamburger button - mobile only */}
      <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Links */}
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/"               className="nav-link" onClick={closeMenu}>Home</Link>
        <Link to="/aboutus"        className="nav-link" onClick={closeMenu}>About Us</Link>
        <Link to="/reports"        className="nav-link" onClick={closeMenu}>Reports</Link>
        <Link to="/species"        className="nav-link" onClick={closeMenu}>Species</Link>
        <Link to="/observations"   className="nav-link" onClick={closeMenu}>Observations</Link>
        <Link to="/addobservation" className="nav-link" onClick={closeMenu}>Add Observation</Link>
        <Link to="/contactus"      className="nav-link" onClick={closeMenu}>Contact Us</Link>
        <Link to="/profile"        className="nav-link" onClick={closeMenu}>Profile</Link>
        {isAdmin && (
          <Link to="/admin/dashboard" className="nav-link admin-link" onClick={closeMenu}>Admin Panel</Link>
        )}

        {/* Show user + logout inside menu on mobile */}
        <div className="nav-user">
          {user && (
            <span className="nav-username">
              👤 {user.user_metadata?.full_name || user.email}
            </span>
          )}
          <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;