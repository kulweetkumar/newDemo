import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (

    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top" >
      <Link className="navbar-brand" to="/">MyApp</Link>
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
          <li className="nav-item" style={{ marginRight: '15px' }}>
            <Link className="nav-link" style={linkStyle} to="/login">Login</Link>
          </li>
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
