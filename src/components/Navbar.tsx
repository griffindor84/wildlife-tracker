import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        {/* You can replace this emoji with an image logo later */}
        <span className="logo">🐾</span>
        <span className="brand-name">Wildlife Tracker</span>
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
     
        <Link to="/reports" className="nav-link">Reports</Link>
        <Link to="/species" className="nav-link">Species</Link>
        <Link to="/observations" className="nav-link">Observations</Link>
      </div>
    </nav>
  );
}

export default Navbar;
