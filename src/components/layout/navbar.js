import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/images/logo.webp';
import { authLogout } from '../../redux/actions/authActions';

const Navbar = () => {
  const { isAuthenticated } = useSelector(state => state.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(authLogout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <Link className="navbar-brand" to="/">
        <img src={logo} alt="Logo" style={{ height: '40px' }} />
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto" style={{ display: 'flex', listStyleType: 'none', margin: 0, padding: 0, justifyContent: 'left' }}>
          {isAuthenticated ? (
            <>
              <NavItem to="/" text="Home" />
              <NavItem to="/about" text="About" />
              <NavItem to="/contact-us" text="Contact Us" />
              <NavItem to="/privacy-policy" text="Privacy Policy" />
              <NavItem to="/term-condition" text="Terms & Conditions" />
              <li className="nav-item" style={{ marginRight: '15px' }}>
                <button className="nav-link btn btn-link" style={{ ...linkStyle, cursor: 'pointer' }} onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <NavItem to="/login" text="Login" />
              <NavItem to="/signup" text="Signup" />
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

const NavItem = ({ to, text }) => (
  <li className="nav-item" style={{ marginRight: '15px' }}>
    <Link className="nav-link" style={linkStyle} to={to}>{text}</Link>
  </li>
);

const linkStyle = {
  color: "white",
  textDecoration: 'none',
  padding: '10px 15px',
};

export default Navbar;
