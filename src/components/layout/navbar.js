import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/images/logo.webp';
import { authLogout } from '../../redux/actions/index';

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
    }
  };

  // Debugging logs
  console.log('Navbar isAuthenticated:', isAuthenticated);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <Link className="navbar-brand" to="/">
        <img src={logo} alt="Logo" style={{ height: '40px' }} />
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto" style={{ display: 'flex', listStyleType: 'none', margin: 0, padding: 0, justifyContent: 'left' }}>
          <li className="nav-item" style={{ marginRight: '15px' }}>
            <Link className="nav-link" style={linkStyle} to="/">Home</Link>
          </li>
          <li className="nav-item" style={{ marginRight: '15px' }}>
            <Link className="nav-link" style={linkStyle} to="/about">About</Link>
          </li>
          <li className="nav-item" style={{ marginRight: '15px' }}>
            <Link className="nav-link" style={linkStyle} to="/contact-us">Contact Us</Link>
          </li>
          <li className="nav-item" style={{ marginRight: '15px' }}>
            <Link className="nav-link" style={linkStyle} to="/privacy-policy">Privacy Policy</Link>
          </li>
          <li className="nav-item" style={{ marginRight: '15px' }}>
            <Link className="nav-link" style={linkStyle} to="/term-condition">Terms & Conditions</Link>
          </li>
          {isAuthenticated ? (
            <li className="nav-item" style={{ marginRight: '15px' }}>
              <button className="nav-link btn btn-link" style={{ ...linkStyle, cursor: 'pointer' }} onClick={handleLogout}>Logout</button>
            </li>
          ) : (
            <li className="nav-item" style={{ marginRight: '15px' }}>
              <Link className="nav-link" style={linkStyle} to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: '10px 15px',
};

export default Navbar;
