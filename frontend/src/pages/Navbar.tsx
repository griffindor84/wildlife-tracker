import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import './Navbar.css';

function Navbar() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(() => navigate('/'));
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="logo">🐾</span>
        <span className="brand-name">Wildpath</span>
      </div>

      <div className="nav-links">
        <Link to="/"                className="nav-link">Home</Link>
        <Link to="/admin/dashboard" className="nav-link">Admin Panel</Link>
        <Link to="/profile"         className="nav-link">Profile</Link>
        <Link to="/reports"         className="nav-link">Reports</Link>
        <Link to="/species"         className="nav-link">Species</Link>
        <Link to="/observations"    className="nav-link">Observations</Link>
        <Link to="/addobservation"  className="nav-link">Add Observation</Link>
         <Link to="/aboutus"         className="nav-link">About Us</Link>
        <Link to="/contactus"       className="nav-link">Contact Us</Link>
      </div>

      <div className="nav-user">
        {user && (
          <span className="nav-username">
            👤 {user.firstName || user.fullName || user.primaryEmailAddress?.emailAddress}
          </span>
        )}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;