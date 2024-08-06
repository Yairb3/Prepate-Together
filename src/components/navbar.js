import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './authContext'; // Import the useAuth hook
import './navbar.css';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        {!isLoggedIn ? (
          <>
            <li className="nav-item">
              <Link to="/register" className="nav-link">Register</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">Profile</Link>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link">Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
