import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/login" className="nav-link">Login</Link>
      <Link to="/register" className="nav-link">Register</Link>
      <Link to="/reports" className="nav-link">Reports</Link>
      <Link to="/species" className="nav-link">Species</Link>
      <Link to="/observations" className="nav-link">Observations</Link>
    </nav>
  );
}

export default Navbar;
