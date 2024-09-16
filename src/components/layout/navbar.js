import React from 'react';
import { Link} from 'react-router-dom';
import {  useSelector } from 'react-redux';
import logo from '../../assets/images/logo.webp';

const Navbar = () => {
  const { isAuthenticated } = useSelector(state => state.Auth);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <Link className="navbar-brand" to="/">
        <img src={logo} alt="Logo" style={{ height: '40px' }} />
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto" style={{ display: 'flex', listStyleType: 'none', margin: 0, padding: 0, justifyContent: 'left' }}>
          {isAuthenticated ? (
            <>
              <NavItem to="/admin/dashboard" text="DashBoard" />

            </>

          ) : (
            <>
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
