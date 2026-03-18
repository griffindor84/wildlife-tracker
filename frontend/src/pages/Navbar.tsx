import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="logo">🐾</span>
        <span className="brand-name">Wildpath</span>
      </div>

      <div className="nav-links">
        <Link to="/"               className="nav-link">Home</Link>
        <Link to="/aboutus"        className="nav-link">About Us</Link>
        <Link to="/reports"        className="nav-link">Reports</Link>
        <Link to="/species"        className="nav-link">Species</Link>
        <Link to="/observations"   className="nav-link">Observations</Link>
        <Link to="/addobservation" className="nav-link">Add Observation</Link>
        <Link to="/contactus"      className="nav-link">Contact Us</Link>
        <Link to="/profile"        className="nav-link">Profile</Link>
        {isAdmin && (
          <Link to="/admin/dashboard" className="nav-link admin-link">Admin Panel</Link>
        )}
      </div>

      <div className="nav-user">
        {user && (
          <span className="nav-username">
            👤 {user.user_metadata?.full_name || user.email}
          </span>
        )}
        <button onClick={handleLogout} className="nav-logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;