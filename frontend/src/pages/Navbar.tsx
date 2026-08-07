import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar" ref={menuRef}>
      {/* Hamburger LEFT — mobile only */}
      <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Brand */}
      <div className="nav-brand">
        <span className="logo">🐾</span>
        <span className="brand-name">Wildpath</span>
      </div>

      {/* Nav links */}
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/"               className="nav-link" onClick={closeMenu}>Home</Link>
        <Link to="/aboutus"        className="nav-link" onClick={closeMenu}>About Us</Link>
        <Link to="/reports"        className="nav-link" onClick={closeMenu}>Reports</Link>
        <Link to="/species"        className="nav-link" onClick={closeMenu}>Species</Link>
        <Link to="/observations"   className="nav-link" onClick={closeMenu}>My Observations</Link>
        <Link to="/addobservation" className="nav-link" onClick={closeMenu}>Add Observation</Link>
        <Link to="/contactus"      className="nav-link" onClick={closeMenu}>Contact Us</Link>
        <Link to="/profile"        className="nav-link" onClick={closeMenu}>Profile</Link>
        {isAdmin && (
          <Link to="/admin/dashboard" className="nav-link admin-link" onClick={closeMenu}>Admin Panel</Link>
        )}

        {/* Username inside mobile menu */}
        <div className="nav-user-mobile">
          {user && (
            <span className="nav-username">
              👤 {user.user_metadata?.full_name || user.email}
            </span>
          )}
        </div>
      </div>

      {/* Desktop: username only on RIGHT */}
      <div className="nav-user-desktop">
        {user && (
          <span className="nav-username">
            👤 {user.user_metadata?.full_name || user.email}
          </span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
