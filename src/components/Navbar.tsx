import { Link } from 'react-router-dom';
import './Navbar.css';
import '../admin/AdminLayout' // Importing sidebar styles for consistency

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        {/* You can replace this emoji with an image logo later */}
        <span className="logo">🐾</span>
        <span className="brand-name">Wildpath</span>
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/aboutus" className="nav-link">About Us</Link>
        <Link to="/admin/dashboard" className="nav-link">Admin Panel</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <Link to="/reports" className="nav-link">Reports</Link>
        <Link to="/species" className="nav-link">Species</Link>
        <Link to="/observations" className="nav-link">Observations</Link>
        <Link to="/addobservation" className="nav-link">Advertisement</Link>
        <Link to="/contactus" className="nav-link">Contact Us</Link>
      </div>
    </nav>
  );
}

export default Navbar;
