import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#333', padding: '10px 0' }}>
      <ul style={{ display: 'flex', listStyleType: 'none', margin: 0, padding: 0, justifyContent: 'left' }}>
        <li style={{ marginRight: '15px' }}>
          <Link style={linkStyle} to="/">Home</Link>
        </li>
        <li style={{ marginRight: '15px' }}>
          <Link style={linkStyle} to="/about">About</Link>
        </li>
        <li style={{ marginRight: '15px' }}>
          <Link style={linkStyle} to="/privacy-policy">Privacy Policy</Link>
        </li>
        <li style={{ marginRight: '15px' }}>
          <Link style={linkStyle} to="/term-condition">Term & Condition</Link>
        </li>
        <li>
          <Link style={linkStyle} to="/contact-us">Contact Us</Link>
        </li>
      </ul>
    </nav>
  );
};
const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: '10px 15px',
};

export default Navbar;
