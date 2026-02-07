import { Link } from 'react-router-dom';

function Navbar (){
    return(
        <nav style={{ padding: '1rem', backgroundColor: '#eee' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
      <Link to="/register"style={{ marginRight: '1rem' }}>Register</Link>
      <Link to="/aboutus" style={{ marginRight: '1rem' }}>About Us</Link>
      <Link to="/contactus" style={{ marginRight: '1rem' }}>Contact Us</Link>
      <Link to="/addobservation" style={{ marginRight: '1rem' }}>Add Observation</Link>


    </nav>
    )
}
export default Navbar;